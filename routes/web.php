<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DraftJobsController;
use App\Http\Controllers\FinalizedJobsController;
use App\Http\Controllers\SickLeavesController;
use App\Http\Controllers\AnnualLeavesController;
use App\Http\Controllers\AdminExtraController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\JobPlansController;
use App\Http\Controllers\BahnCardController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Mail\MyTestEmail;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\UsersBonusController;
use App\Http\Controllers\UsersAdvanceController;
use App\Http\Controllers\HourBankController;
use App\Http\Controllers\ProfessionsController;
use App\Http\Controllers\AggreementController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\UserCertificateController;
use App\Http\Controllers\UsersAggreementsController;
use App\Http\Controllers\UserSalaryReportController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\JobNotesController;
use App\Http\Controllers\GPSLocationController;
use App\Http\Controllers\ToDoController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\HotelController;
use Illuminate\Http\Request;

use App\Events\UserRegistered;



use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
    /*return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);*/
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('dashboard');

Route::get('/users/index', function () {
    return Inertia::render('Admin/Users/Index');
})->middleware(['auth', 'verified', IsAdmin::class])->name('users.index');

Route::get('/admin/bahn-cards', function () {
    return Inertia::render('Admin/BahnCards/Index');
})->middleware(['auth', 'verified'])->name('bahn-cards');

Route::get('/admin/aggreements', function () {
    return Inertia::render('Admin/Aggreements/Index');
})->middleware(['auth', 'verified'])->name('aggreements.view');

Route::get('/admin/hotels/history', function () {
    return Inertia::render('Admin/Hotels/History');
})->middleware(['auth', 'verified'])->name('hotels.history');

Route::get('/hotels', [HotelController::class, 'index'])->middleware(['auth', 'verified'])->name('hotels.index');
Route::post('/hotels', [HotelController::class, 'store'])->middleware(['auth', 'verified'])->name('hotels.store');
Route::delete('/hotels/{id}', [HotelController::class, 'destroy'])->middleware(['auth', 'verified'])->name('hotels.destroy');
Route::get('/hotels/tour-names', [HotelController::class, 'getTourNames'])->middleware(['auth', 'verified'])->name('hotels.tour-names');

Route::get('/admin/aggreements/create', function () {
    return Inertia::render('Admin/Aggreements/Create');
})->middleware(['auth', 'verified'])->name('aggreements.create');

Route::get('/admin/aggreements/edit/{id}', function ($id) {
    return Inertia::render('Admin/Aggreements/Edit', ['id' => $id]);
})->middleware(['auth', 'verified'])->name('aggreements.edit');

Route::get('/admin/programs', function () {
    return Inertia::render('Admin/Programs/Index');
})->middleware(['auth', 'verified'])->name('programs.view');

Route::get('/admin/programs/create', function () {
    return Inertia::render('Admin/Programs/Create');
})->middleware(['auth', 'verified'])->name('programs.create');

Route::get('/admin/programs/edit/{id}', function ($id) {
    return Inertia::render('Admin/Programs/Edit', ['id' => $id]);
})->middleware(['auth', 'verified'])->name('programs.edit');

Route::get('/admin/todo', function () {
    return Inertia::render('Admin/Todo/Index');
})->middleware(['auth', 'verified'])->name('todo.view');



Route::get('/admin/bahn-cards/create', function () {
    return Inertia::render('Admin/BahnCards/Create');
})->middleware(['auth', 'verified'])->name('bahn-cards.create');

Route::get('/admin/bahn-cards/{id}', function ($id) {
    return Inertia::render('Admin/BahnCards/Edit', ['id' => $id]);
})->middleware(['auth', 'verified'])->name('bahn-cards.edit');


Route::get('/users/hour-banks/{user_id}', function ($user_id) {
    return Inertia::render('Admin/Users/HourBanks', ['user_id' => $user_id]);
})->middleware(['auth', 'verified'])->name('users-hour-banks.show');


Route::get('/users/bonus/{user_id}', function ($user_id) {
    return Inertia::render('Admin/Users/Bonus', ['user_id' => $user_id]);
})->middleware(['auth', 'verified'])->name('users-bonus.show');

Route::get('/users/advance/{user_id}', function ($user_id) {
    return Inertia::render('Admin/Users/Advance', ['user_id' => $user_id]);
})->middleware(['auth', 'verified'])->name('users-advance.show');

Route::get('/users/edit/{user_id}', function ($user_id) {
    return Inertia::render('Admin/Users/Edit', ['user_id' => $user_id]);
})->middleware(['auth', 'verified', IsAdmin::class])->name('users.edit');

Route::get('/clients/index', function () {
    return Inertia::render('Admin/Clients/Index');
})->middleware(['auth', 'verified', IsAdmin::class])->name('clients-index');

Route::get('/users/create', function () {
    return Inertia::render('Admin/Users/Create');
})->middleware(['auth', 'verified', IsAdmin::class])->name('users.create');


Route::get('/clients/create', function () {
    return Inertia::render('Admin/Clients/Create');
})->middleware(['auth', 'verified', IsAdmin::class])->name('clients.create');


Route::get('/clients/edit/{client_id}', function ($client_id) {
    return Inertia::render('Admin/Clients/Edit', ['client_id' => $client_id]);
})->middleware(['auth', 'verified', IsAdmin::class])->name('clients.edit');

Route::get('/confirmed-jobs', function () {
    return Inertia::render('Admin/Jobs/Confirmed');
})->middleware(['auth', 'verified', IsAdmin::class])->name('confirmed-jobs');

Route::get('/confirmed-jobs-to-client', function () {
    return Inertia::render('Admin/Jobs/ConfirmedToClient');
})->middleware(['auth', 'verified', IsAdmin::class])->name('confirmed-jobs-to-client');

Route::get('/wait-confirmation-jobs', function () {
    return Inertia::render('Admin/Jobs/WaitingConfirmed');
})->middleware(['auth', 'verified', IsAdmin::class])->name('wait-confirmed-jobs');

Route::get('/confirmed-jobs-to-edit', function () {
    return Inertia::render('Admin/Jobs/ConfirmedToEdit');
})->middleware(['auth', 'verified', IsAdmin::class])->name('confirmed-jobs-to-edit');

Route::get('/admin/planner', function () {
    return Inertia::render('Admin/Jobs/Planner');
})->middleware(['auth', 'verified', IsAdmin::class])->name('admin-planner');

Route::get('/admin/holiday-planner', function () {
    return Inertia::render('Admin/Jobs/HolidayPlanner');
})->middleware(['auth', 'verified', IsAdmin::class])->name('admin-holiday-planner');

Route::get('/reports/certifications', function () {
    return Inertia::render('Admin/Reports/Certifications');
})->middleware(['auth', 'verified', IsAdmin::class])->name('admin-certifications');

Route::get('/clients/new-job', function () {
    return Inertia::render('Admin/Jobs/Create');
})->middleware(['auth', 'verified', IsAdmin::class])->name('clients.new-job');


Route::get('/new-jobs', function () {
    return Inertia::render('NewJobs');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('new-jobs');

Route::get('/draft-jobs', function () {
    return Inertia::render('DraftJobs');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('draft-jobs');

Route::get('/finalized-jobs', function () {
    return Inertia::render('FinalizedJobs');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('finalized-jobs');

Route::get('/planner', function () {
    return Inertia::render('Planner');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('planner');

Route::get('/sick-leaves', function () {
    return Inertia::render('SickLeaves');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('sick-leaves');

Route::get('/annual-leaves', function () {
    return Inertia::render('AnnualLeaves');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('annual-leaves');


Route::get('/test-sign', function () {
    return Inertia::render('TestSign');
})->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('test-sign');


Route::get('/data-draft-jobs', [DraftJobsController::class, 'index'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('data-draft-jobs');
Route::post('/save-draft-jobs', [DraftJobsController::class, 'store'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('save-draft-jobs');
Route::post('/delete-draft-jobs', [DraftJobsController::class, 'destroy'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('delete-draft-jobs');
Route::post('/send-submit-draft-jobs', [DraftJobsController::class, 'send_submit'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('send-submit-draft-jobs');
Route::post('/update-draft-jobs', [DraftJobsController::class, 'update'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('update-draft-jobs');
Route::post('/update-draft-job-inside', [DraftJobsController::class, 'edit_update'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('update-draft-job-inside');

Route::post('/upload', [FileUploadController::class, 'upload'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('upload');



Route::get('/data-unconfirmed-jobs', [FinalizedJobsController::class, 'unconfirmed_jobs'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('data-unconfirmed-jobs');
Route::get('/data-confirmed-jobs', [FinalizedJobsController::class, 'confirmed_jobs'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('data-confirmed-jobs');
Route::post('/jobs-editing', [FinalizedJobsController::class, 'edit'])->middleware(['auth', 'verified', IsAdmin::class])->name('jobs-editing');
Route::post('/jobs-confirmation', [FinalizedJobsController::class, 'confirm_jobs'])->middleware(['auth', 'verified', IsAdmin::class])->name('jobs-confirmation');
Route::get('/admin/wait-confirmed-jobs-count', [FinalizedJobsController::class, 'wait_confirmed_jobs'])->middleware(['auth', 'verified', IsAdmin::class])->name('wait-confirmed-jobs-count');
Route::get('/admin/show-user/{user_id}', [RegisteredUserController::class, 'show_user'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.show');

Route::get('/todo', [ToDoController::class, 'index'])->middleware(['auth', 'verified'])->name('todo');
Route::get('/get-weekly-todos', [ToDoController::class, 'get_weekly_todos'])->middleware(['auth', 'verified'])->name('get-weekly-todos');
Route::post('/todo', [ToDoController::class, 'store'])->middleware(['auth', 'verified'])->name('todo.store');
Route::put('/todo/{id}', [ToDoController::class, 'update'])->middleware(['auth', 'verified'])->name('todo.update');
Route::delete('/todo/{id}', [ToDoController::class, 'destroy'])->middleware(['auth', 'verified'])->name('todo.destroy');


Route::get('/stationsa', [StationController::class, 'index'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('stations');
Route::get('/stations/{id}', [StationController::class, 'show'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('stations.show');
Route::get('/stations-search', [StationController::class, 'search'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('stations-search');


Route::get('/professions', [ProfessionsController::class, 'index'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('professions');
Route::post('/professions', [ProfessionsController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('professions-store');
Route::post('/add-user-profession/{user_id}', [ProfessionsController::class, 'add_user_profession'])->middleware(['auth', 'verified', IsAdmin::class])->name('add-user-profession');
Route::get('/get-user-professions/{user_id}', [ProfessionsController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('get-user-professions');
Route::delete('/delete-user-professions/{user_id}/{profession_id}', [ProfessionsController::class, 'delete_user_profession'])->middleware(['auth', 'verified', IsAdmin::class])->name('delete-user-professions');

Route::post('/add-user-clients/{user_id}', [RegisteredUserController::class,  'add_user_clients'])->middleware(['auth', 'verified', IsAdmin::class])->name('add-user-clients');
Route::get('/get-user-clients/{user_id}', [RegisteredUserController::class, 'show_user_clients'])->middleware(['auth', 'verified', IsAdmin::class])->name('get-user-clients');
Route::get('/get-clients-users', [RegisteredUserController::class, 'get_clients_users'])->middleware(['auth', 'verified', IsAdmin::class])->name('get-clients-users');
Route::delete('/delete-user-clients/{user_id}/{client_id}', [RegisteredUserController::class, 'delete_user_clients'])->middleware(['auth', 'verified', IsAdmin::class])->name('delete-user-clients');





Route::get('/agreements', [AggreementController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('aggreements');
Route::get('/agreements/{id}', [AggreementController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('aggreements.show');
Route::post('/agreements', [AggreementController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('aggreements.store');
Route::put('/agreements/{id}', [AggreementController::class, 'update'])->middleware(['auth', 'verified', IsAdmin::class])->name('aggreements.update');
Route::delete('/agreements/{id}', [AggreementController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('aggreements.destroy');


Route::get('/programs', [ProgramController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('programs');
Route::get('/user-programs/{user_id}', [ProgramController::class, 'user_programs'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.programs');
Route::post('/programs', [ProgramController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('programs.store');
Route::post('/user-programs/{user_id}', [ProgramController::class, 'user_programs_store'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.programs.store');
Route::get('/programs/{id}', [ProgramController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('programs.show');
Route::put('/programs/{id}', [ProgramController::class, 'update'])->middleware(['auth', 'verified', IsAdmin::class])->name('programs.update');
Route::delete('/programs/{id}', [ProgramController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('programs.destroy');
Route::delete('/user-programs/{id}', [ProgramController::class, 'user_programs_destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.programs.destroy');






Route::get('/certificates', [CertificateController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates');
Route::get('/certificates-get', [CertificateController::class, 'getCertificates'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates-get');
Route::get('/certificates/create', [CertificateController::class, 'create'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates.create');
Route::post('/certificates', [CertificateController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates.store');
Route::get('/certificates/{id}', [CertificateController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates.show');
Route::get('/certificates/edit/{id}', [CertificateController::class, 'edit'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates.edit');
Route::put('/certificates/{id}', [CertificateController::class, 'update'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates.update');
Route::delete('/certificates/{id}', [CertificateController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('certificates.destroy');






Route::get('/get-user-certificates/{user_id}', [UserCertificateController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('get-user-certificates');
Route::post('/user-certificates', [UserCertificateController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.certificate.store');
Route::delete('/user-certificates/{id}', [UserCertificateController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.certificate.destroy');


Route::get('/get-user-agreements/{user_id}', [UsersAggreementsController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('get-user-agreements');
Route::post('/user-agreements', [UsersAggreementsController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.agreement.store');
Route::delete('/user-agreements/{id}', [UsersAggreementsController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('user.agreement.destroy');


Route::get('/finalized-filter', [FinalizedJobsController::class, 'get_filters'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('finalized-filter');
Route::get('/admin/finalized-jobs', [FinalizedJobsController::class, 'index']);
Route::post('/admin/register_inside', [RegisteredUserController::class, 'store_inside'])->middleware(['auth', 'verified', IsAdmin::class])->name('register.inside');
Route::post('/admin/edit_inside', [RegisteredUserController::class, 'edit_inside'])->middleware(['auth', 'verified', IsAdmin::class])->name('edit.inside');

Route::get('/admin/all-bahn-cards', [BahnCardController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('all-bahn-cards');
Route::get('/admin/all-bahn-cards/{id}', [BahnCardController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('bahn-cards-show');
Route::get('/admin/user-bahn-cards/{user_id}', [BahnCardController::class, 'show_user_bahn_cards'])->middleware(['auth', 'verified', IsAdmin::class])->name('bahn-cards-show-user');
Route::post('/admin/bahn-cards', [BahnCardController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('bahn-cards-store');
Route::delete('/admin/bahn-cards/{id}', [BahnCardController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('bahn-cards-destroy');
Route::put('/admin/bahn-cards/{id}', [BahnCardController::class, 'update'])->middleware(['auth', 'verified', IsAdmin::class])->name('bahn-cards-update');

Route::get('/planner/jobs', [JobPlansController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs');
Route::get('/planner/jobs/without-user', [JobPlansController::class, 'index_without_user'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs-without-user');
Route::get('/planner/jobs/show/{id}', [JobPlansController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs-show');
Route::post('/planner/jobs', [JobPlansController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs-store');
Route::put('/planner/jobs/update/{job}', [JobPlansController::class, 'update'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs-update');
Route::put('/planner/jobs/{id}', [JobPlansController::class, 'leave_job'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs-leave');
Route::delete('/planner/jobs', [JobPlansController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('planner-jobs-destroy');
Route::get('/planner/jobs/get-users-jobs', [JobPlansController::class, 'get_users_jobs'])->middleware(['auth', 'verified'])->name('get-users-jobs');


Route::get('/planner/jobs/job-notes', [JobNotesController::class, 'index'])->middleware(['auth', 'verified'])->name('job-notes');
Route::get('/planner/jobs/job-notes/{id}', [JobNotesController::class, 'show'])->middleware(['auth', 'verified'])->name('job-notes-show');
Route::post('/planner/jobs/job-notes', [JobNotesController::class, 'store'])->middleware(['auth', 'verified'])->name('job-notes-store');
Route::put('/planner/jobs/job-notes/{id}', [JobNotesController::class, 'update'])->middleware(['auth', 'verified'])->name('job-notes-update');
Route::delete('/planner/jobs/job-notes/{id}', [JobNotesController::class, 'destroy'])->middleware(['auth', 'verified'])->name('job-notes-destroy');

Route::get('/planner/jobs/edit/{id}', function ($id) {
    return Inertia::render('Admin/Jobs/Edit', ['id' => $id]);
})->middleware(['auth', 'verified'])->name('planner-jobs-edit');

Route::delete('/planner/jobs/delete/{id}', [JobPlansController::class, 'destroy'])->middleware(['auth', 'verified'])->name('planner-jobs-delete');

Route::get('/sick-leaves', [SickLeavesController::class, 'index'])->middleware(['auth', 'verified'])->name('sick-leaves');
Route::post('/sick-leaves', [SickLeavesController::class, 'store'])->middleware(['auth', 'verified'])->name('sick-leaves-store');
Route::delete('/sick-leaves/{id}', [SickLeavesController::class, 'destroy'])->middleware(['auth', 'verified'])->name('sick-leaves-destroy');


Route::get('/annual-leaves', [AnnualLeavesController::class, 'index'])->middleware(['auth', 'verified'])->name('annual-leaves');
Route::post('/annual-leaves', [AnnualLeavesController::class, 'store'])->middleware(['auth', 'verified'])->name('annual-leaves-store');
Route::delete('/annual-leaves/{id}', [AnnualLeavesController::class, 'destroy'])->middleware(['auth', 'verified'])->name('annual-leaves-destroy');

Route::get('/admin-extras', [AdminExtraController::class, 'index'])->middleware(['auth', 'verified'])->name('admin-extras');
Route::post('/admin-extras', [AdminExtraController::class, 'store'])->middleware(['auth', 'verified'])->name('admin-extras-store');
Route::delete('/admin-extras/{id}', [AdminExtraController::class, 'destroy'])->middleware(['auth', 'verified'])->name('admin-extras-destroy');

Route::get('/user-confirmed-jobs', [FinalizedJobsController::class, 'user_confirmed_jobs'])->middleware(['auth', 'verified'])->name('user-confirmed-jobs');
Route::post('/user-leave-jobs', [RegisteredUserController::class, 'leave_jobs'])->middleware(['auth', 'verified'])->name('user-leave-jobs');
//Route::get('/planner/jobs/get-user-jobs', [JobPlansController::class, 'get_user_job_plans'])->middleware(['auth', 'verified'])->name('get-user-job-plans');
Route::delete('/jobs-unconfirmed', [FinalizedJobsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('jobs-unconfirmed-destroy');

Route::get('/admin/clients', [ClientController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('admin-clients');
Route::post('/admin/clients', [ClientController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('admin-clients-store');
Route::delete('/admin/clients/{id}', [ClientController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('admin-clients-destroy');
Route::get('/admin/clients/{id}', [ClientController::class, 'show'])->middleware(['auth', 'verified', IsAdmin::class])->name('admin-clients-show');
Route::put('/admin/clients/{id}', [ClientController::class, 'update'])->middleware(['auth', 'verified', IsAdmin::class])->name('admin-clients-update');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->withoutMiddleware([IsAdmin::class])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->withoutMiddleware([IsAdmin::class])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->withoutMiddleware([IsAdmin::class])->name('profile.destroy');
    Route::get('/clients', [ClientController::class, 'index'])->withoutMiddleware([IsAdmin::class])->name('clients.index');
    Route::post('/finalized-jobs/export', [FinalizedJobsController::class, 'get_finalized'])->withoutMiddleware([IsAdmin::class])->name('get-finalized');
    Route::post('/finalized-jobs/get-total-report', [FinalizedJobsController::class, 'get_total_report'])->withoutMiddleware([IsAdmin::class])->name('get-total-report');
    Route::post('/finalized-jobs/get-confirmed-jobs', [FinalizedJobsController::class, 'get_confirmed_jobs'])->withoutMiddleware([IsAdmin::class])->name('get-confirmed-jobs');
    Route::post('/finalized-jobs/export-client', [FinalizedJobsController::class, 'get_finalized_client'])->withoutMiddleware([IsAdmin::class])->name('get-finalized-client');
    Route::post('/finalized-jobs/export-client-pdf', [FinalizedJobsController::class, 'get_finalized_client_pdf'])->withoutMiddleware([IsAdmin::class])->name('get-finalized-client-pdf');
    Route::get('/download-pdf/{filename}', [PdfController::class, 'downloadPdf'])->withoutMiddleware([IsAdmin::class])->name('download.pdf');
    Route::get('/planner/jobs/get-user-jobs', [JobPlansController::class, 'get_user_job_plans'])->withoutMiddleware([IsAdmin::class])->name('get-user-job-plans');
});

Route::get('/get_user_bonus/{user_id}', [UsersBonusController::class, 'show'])->middleware(['auth', 'verified'])->name('get-user-bonus');
Route::post('/add-bonus/{user_id}', [UsersBonusController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('add-bonus');
Route::delete('/delete-bonus/{bonus_id}', [UsersBonusController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('delete-bonus');

Route::get('user-salary-reports/{user_id}', [UserSalaryReportController::class, 'index'])->name('user.salary.show');
Route::post('user-salary-reports', [UserSalaryReportController::class, 'store'])->name('user.salary.store');
Route::delete('user-salary-reports/{id}', [UserSalaryReportController::class, 'destroy'])->name('user.salary.destroy');

Route::get('/get_user_advances/{user_id}', [UsersAdvanceController::class, 'show'])->middleware(['auth', 'verified'])->name('get-user-advances');
Route::post('/add-advances/{user_id}', [UsersAdvanceController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('add-advances');
Route::delete('/delete-advances/{advances_id}', [UsersAdvanceController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('delete-advances');

Route::get('/hour-banks/{user_id}', [HourBankController::class, 'index'])->middleware(['auth', 'verified'])->name('hour-banks');
Route::post('/add-hour-bank/{user_id}', [HourBankController::class, 'store'])->middleware(['auth', 'verified', IsAdmin::class])->name('add-hour-bank');
Route::delete('/delete-hour-bank/{hour_bank_id}', [HourBankController::class, 'destroy'])->middleware(['auth', 'verified', IsAdmin::class])->name('delete-hour-bank');
Route::get('/hour-banks/{user_id}', [HourBankController::class, 'index'])->middleware(['auth', 'verified', IsAdmin::class])->name('get-user-hour-banks');



Route::get('/gps-locations', [GPSLocationController::class, 'index'])->withoutMiddleware([IsAdmin::class, 'auth', 'verified'])->name('gps-locations');
Route::put('/gps-locations', [GPSLocationController::class, 'store'])->withoutMiddleware([IsAdmin::class, 'auth', 'verified'])->name('gps-locations-store');
/*Route::put('/gps-locations', function() {
    dd('deneme');
})->withoutMiddleware([IsAdmin::class,'auth', 'verified'])->name('gps-locations-store');*/
Route::delete('/gps-locations/{id}', [GPSLocationController::class, 'destroy'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('gps-locations-destroy');
Route::get('/gps-locations/{id}', [GPSLocationController::class, 'show'])->middleware(['auth', 'verified'])->withoutMiddleware([IsAdmin::class])->name('gps-locations-show');
Route::put('/gps-locations/{id}', [GPSLocationController::class, 'update'])->middleware(['auth', 'verified'])->name('gps-locations-update');
Route::delete('/gps-locations/{id}', [GPSLocationController::class, 'destroy'])->middleware(['auth', 'verified'])->name('gps-locations-destroy');

Route::get('/testroute', function () {
    $name = "Funny Coder";
    Mail::to('samimcanboke@hotmail.com')->send(new MyTestEmail($name));
});

Route::post('/send-email', [UserCertificateController::class, 'send_email'])->middleware(['auth', 'verified'])->name('send-email');

Route::get('/test-email', function () {
    $user = \App\Models\User::first(); // Örneğin ilk kullanıcıya mail gönderelim
    $asd = Mail::to($user->email)->send(new WelcomeMail($user));
    dd($asd);
    return 'Mail sent!';
})->withoutMiddleware(['auth', 'verified', IsAdmin::class]);

Route::get('/trigger-event', function () {
    $user = \App\Models\User::first(); // Örneğin ilk kullanıcı
    $a = event(new UserRegistered($user));
    dd($a);
    return 'Event triggered!';
})->withoutMiddleware(['auth', 'verified', IsAdmin::class]);

Route::get('/check-certificates', function () {
    $expiredCertificates = \App\Models\UserCertificate::whereRaw('DATE_SUB(validity_date, INTERVAL reminder_day DAY) <= CURDATE()')->get();
    foreach ($expiredCertificates as $certificate) {
        Mail::to('sadettin.gokcen@westwind-eisenbahnservice.de')->send(new \App\Mail\CertificateExpired($certificate->certificate->name, $certificate->user->name));
    }
});

Route::get('/check-bahn-cards', function () {
    $expiredBahnCards = \App\Models\BahnCard::whereRaw('DATE_SUB(valid_to, INTERVAL 10 DAY) <= CURDATE()')->with('user')->get();
    foreach ($expiredBahnCards as $bahnCard) {
        Mail::to('sadettin.gokcen@westwind-eisenbahnservice.de')->send(new \App\Mail\CertificateExpired($bahnCard->number, $bahnCard->user->name));
    }
});



require __DIR__ . '/auth.php';
