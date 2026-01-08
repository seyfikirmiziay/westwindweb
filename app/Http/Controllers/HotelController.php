<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Client;
use App\Models\User;
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

        if ($request->month && $request->year) {
            $startDate = \Carbon\Carbon::create($request->year, $request->month, 1)->startOfMonth();
            $endDate = \Carbon\Carbon::create($request->year, $request->month, 1)->endOfMonth();
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } elseif ($request->week && $request->year) {
            $startDate = \Carbon\Carbon::now()->setISODate($request->year, $request->week)->startOfWeek();
            $endDate = \Carbon\Carbon::now()->setISODate($request->year, $request->week)->endOfWeek();
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $hotels = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $hotels
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'user_id' => 'required|exists:users,id',
            'hotel_name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
            'invoice_file' => 'nullable|string',
        ]);

        $hotel = Hotel::create([
            'client_id' => $request->client_id,
            'user_id' => $request->user_id,
            'hotel_name' => $request->hotel_name,
            'address' => $request->address,
            'notes' => $request->notes,
            'invoice_file' => $request->invoice_file,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Hotel-Verlauf erfolgreich hinzugefügt',
            'data' => $hotel->load(['client', 'user'])
        ]);
    }
}
