<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Client;
use App\Models\User;
use App\Models\FinalizedJobs;
use App\Models\JobPlans;
use App\Models\DraftJobs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $query = Hotel::with(['client', 'user']);

        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Tarih aralığına göre filtreleme - check_in_date ve check_out_date'e göre
        if ($request->month && $request->year) {
            $startDate = \Carbon\Carbon::create($request->year, $request->month, 1)->startOfMonth();
            $endDate = \Carbon\Carbon::create($request->year, $request->month, 1)->endOfMonth();
            // Tarih aralığı ile kesişen kayıtları bul
            $query->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($q2) use ($startDate, $endDate) {
                    // Check-in veya check-out tarihi aralık içinde olanlar
                    $q2->whereBetween('check_in_date', [$startDate->toDateString(), $endDate->toDateString()])
                        ->orWhereBetween('check_out_date', [$startDate->toDateString(), $endDate->toDateString()])
                        // Veya aralığı kapsayanlar
                        ->orWhere(function ($q3) use ($startDate, $endDate) {
                            $q3->where('check_in_date', '<=', $startDate->toDateString())
                                ->where('check_out_date', '>=', $endDate->toDateString());
                        });
                });
                // Eğer tarih bilgisi yoksa created_at'e göre filtrele
                $q->orWhere(function ($q2) use ($startDate, $endDate) {
                    $q2->whereNull('check_in_date')
                        ->whereNull('check_out_date')
                        ->whereBetween('created_at', [$startDate, $endDate]);
                });
            });
        } elseif ($request->week && $request->year) {
            $startDate = \Carbon\Carbon::now()->setISODate($request->year, $request->week)->startOfWeek();
            $endDate = \Carbon\Carbon::now()->setISODate($request->year, $request->week)->endOfWeek();
            // Tarih aralığı ile kesişen kayıtları bul
            $query->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($q2) use ($startDate, $endDate) {
                    // Check-in veya check-out tarihi aralık içinde olanlar
                    $q2->whereBetween('check_in_date', [$startDate->toDateString(), $endDate->toDateString()])
                        ->orWhereBetween('check_out_date', [$startDate->toDateString(), $endDate->toDateString()])
                        // Veya aralığı kapsayanlar
                        ->orWhere(function ($q3) use ($startDate, $endDate) {
                            $q3->where('check_in_date', '<=', $startDate->toDateString())
                                ->where('check_out_date', '>=', $endDate->toDateString());
                        });
                });
                // Eğer tarih bilgisi yoksa created_at'e göre filtrele
                $q->orWhere(function ($q2) use ($startDate, $endDate) {
                    $q2->whereNull('check_in_date')
                        ->whereNull('check_out_date')
                        ->whereBetween('created_at', [$startDate, $endDate]);
                });
            });
        }

        $hotels = $query->orderBy('check_in_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Toplam fiyat hesapla (tarih aralığındaki oteller için)
        $totalPrice = 0;
        if ($request->month && $request->year) {
            $filterStart = \Carbon\Carbon::create($request->year, $request->month, 1)->startOfMonth();
            $filterEnd = \Carbon\Carbon::create($request->year, $request->month, 1)->endOfMonth();
        } elseif ($request->week && $request->year) {
            $filterStart = \Carbon\Carbon::now()->setISODate($request->year, $request->week)->startOfWeek();
            $filterEnd = \Carbon\Carbon::now()->setISODate($request->year, $request->week)->endOfWeek();
        } else {
            $filterStart = null;
            $filterEnd = null;
        }

        if ($filterStart && $filterEnd) {
            foreach ($hotels as $hotel) {
                if ($hotel->check_in_date && $hotel->check_out_date && $hotel->price) {
                    $checkIn = \Carbon\Carbon::parse($hotel->check_in_date);
                    $checkOut = \Carbon\Carbon::parse($hotel->check_out_date);

                    // Tarih aralığı ile kesişiyorsa fiyatı ekle
                    if ($checkIn <= $filterEnd && $checkOut >= $filterStart) {
                        $totalPrice += floatval($hotel->price);
                    }
                }
            }
        }

        return response()->json([
            'status' => true,
            'data' => $hotels,
            'total_price' => $totalPrice
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'user_id' => 'required|exists:users,id',
            'hotel_name' => 'nullable|string|max:255',
            'tour_name' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'check_in_date' => 'nullable|date',
            'check_out_date' => 'nullable|date|after_or_equal:check_in_date',
            'notes' => 'nullable|string',
            'invoice_file' => 'nullable|string',
        ]);

        $hotel = Hotel::create([
            'client_id' => $request->client_id,
            'user_id' => $request->user_id,
            'hotel_name' => $request->hotel_name,
            'tour_name' => $request->tour_name,
            'price' => $request->price,
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'notes' => $request->notes,
            'invoice_file' => $request->invoice_file,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Hotel-Verlauf erfolgreich hinzugefügt',
            'data' => $hotel->load(['client', 'user'])
        ]);
    }

    public function getTourNames(Request $request)
    {
        $search = $request->get('search', '');
        $tourNames = collect();

        // FinalizedJobs'tan tour name'leri al
        if ($search) {
            $finalizedTours = FinalizedJobs::whereNotNull('tour_name')
                ->where('tour_name', 'like', '%' . $search . '%')
                ->distinct()
                ->pluck('tour_name');
            $tourNames = $tourNames->merge($finalizedTours);
        } else {
            // İlk yüklemede limit 5
            $finalizedTours = FinalizedJobs::whereNotNull('tour_name')
                ->distinct()
                ->orderBy('tour_name', 'asc')
                ->limit(5)
                ->pluck('tour_name');
            $tourNames = $tourNames->merge($finalizedTours);
        }

        // JobPlans'tan tour name'leri al
        if ($search) {
            $jobPlanTours = JobPlans::whereNotNull('tour_name')
                ->where('tour_name', 'like', '%' . $search . '%')
                ->distinct()
                ->pluck('tour_name');
            $tourNames = $tourNames->merge($jobPlanTours);
        } else {
            // İlk yüklemede limit 5
            $jobPlanTours = JobPlans::whereNotNull('tour_name')
                ->distinct()
                ->orderBy('tour_name', 'asc')
                ->limit(5)
                ->pluck('tour_name');
            $tourNames = $tourNames->merge($jobPlanTours);
        }

        // DraftJobs (taslak işler) tablosundan tour name'leri al
        if ($search) {
            $draftTours = DraftJobs::whereNotNull('tour_name')
                ->where('tour_name', 'like', '%' . $search . '%')
                ->distinct()
                ->pluck('tour_name');
            $tourNames = $tourNames->merge($draftTours);
        } else {
            // İlk yüklemede limit 5
            $draftTours = DraftJobs::whereNotNull('tour_name')
                ->distinct()
                ->orderBy('tour_name', 'asc')
                ->limit(5)
                ->pluck('tour_name');
            $tourNames = $tourNames->merge($draftTours);
        }

        // Tekrarları kaldır ve sırala
        $uniqueTours = $tourNames->unique()->sort()->values();

        // İlk yüklemede (search boşken) maksimum 5 tane göster
        if (!$search) {
            $uniqueTours = $uniqueTours->take(5);
        }

        // React Select formatına çevir
        $formattedTours = $uniqueTours->map(function ($tourName) {
            return [
                'label' => $tourName,
                'value' => $tourName,
            ];
        });

        return response()->json($formattedTours);
    }
}
