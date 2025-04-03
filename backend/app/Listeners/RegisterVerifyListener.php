<?php

namespace App\Listeners;

use App\Events\RegisterEvent;
use App\Mail\VerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Mail;

class RegisterVerifyListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(RegisterEvent $event): void
    {
        Mail::to($event->user['email'])->send(new VerifyEmail($event->user));

    }

    

}
