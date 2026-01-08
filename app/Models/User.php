<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\AnnualLeaves;
use App\Models\SickLeaves;
use App\Models\JobPlans;
use App\Models\FinalizedJobs;
use App\Models\DraftJobs;
use App\Models\AdminExtras;
use App\Models\UsersBonus;
use App\Models\UsersAdvance;
use App\Models\HourBank;
use App\Models\UserCertificate;
use App\Models\UserSalaryReport;
use App\Models\UsersClient;
use Tymon\JWTAuth\Contracts\JWTSubject;




class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'driver_id',
        'birth_date',
        'phone',
        'working_hours',
        'sick_holiday',
        'annual_leave_rights',
        'is_admin',
        'start_working_date',
        'salary',
        'leave_working_date',
        'private_phone',
        'address',
        'nationality',
        'bank_name',
        'bank_account_number',
        'bank_iban',
        'bank_bic',
        'bank_account_holder',
        'insurance_number',
        'social_security_number',
        'social_security_name',
        'kinder',
        'is_retired',
        'tax_class',
        'identity_number',
        'urgency_contact_name',
        'urgency_contact_phone',
        'street',
        'city',
        'zip',
        'apartment',
        'tax_id',
        'accountant',
        'show_on_timeline',
    ];


    public function scopeWithLeaveWorkingDate($query)
    {
        return $query->whereNotNull('leave_working_date');
    }

    public function scopeWithoutLeaveWorkingDate($query)
    {
        return $query->whereNull('leave_working_date');
    }

    public function scopeExcludeAdminsIfAccountant($query)
    {

        if (auth()->user()->accountant) {
            return $query->where('is_admin', false);
        }
        return $query;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function draftJobs()
    {
        return $this->hasMany(DraftJobs::class);
    }

    public function finalizedJobs()
    {
        return $this->hasMany(finalizedJobs::class);
    }

    public function jobPlans()
    {
        return $this->hasMany(JobPlans::class);
    }

    public function sickLeaves()
    {
        return $this->hasMany(SickLeaves::class);
    }

    public function annualLeaves()
    {
        return $this->hasMany(AnnualLeaves::class);
    }

    public function adminExtras()
    {
        return $this->hasMany(AdminExtras::class);
    }

    public function bahnCard()
    {
        return $this->hasOne(BahnCard::class);
    }

    public function usersBonus()
    {
        return $this->hasMany(UsersBonus::class);
    }

    public function usersAdvance()
    {
        return $this->hasMany(UsersAdvance::class);
    }

    public function hourBanks()
    {
        return $this->hasMany(HourBank::class);
    }
    public function userCertificates()
    {
        return $this->hasMany(UserCertificate::class, 'user_id', 'id');
    }

    public function salaryReport()
    {
        return $this->hasMany(UserSalaryReport::class);
    }

    public function usersPrograms()
    {
        return $this->hasMany(UsersPrograms::class);
    }

    public function userClients()
    {
        return $this->hasMany(UsersClient::class);
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class);
    }

    public function jobNotes()
    {
        return $this->hasMany(JobNotes::class);
    }

    public function gpsLocations()
    {
        return $this->hasMany(GPSLocation::class);
    }

    public function usersProfessions()
    {
        return $this->hasMany(UsersProfession::class);
    }

    public function professions()
    {
        return $this->hasManyThrough(Professions::class, UsersProfession::class, 'user_id', 'id', 'id');
    }

    public function usersAnnualLeaves()
    {
        return $this->hasMany(UsersAnnualLeaves::class);
    }

    public function leftAnnualLeaves()
    {
        return $this->usersAnnualLeaves()->get()->sum(function ($annualLeave) {
            return $annualLeave->leftAnnualLeaves();
        });
    }
    public function salaries()
    {
        return $this->hasMany(UserSalary::class);
    }
}
