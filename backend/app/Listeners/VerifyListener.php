<?php

namespace App\Listeners;

use App\Events\VerifyEvent;
use App\Mail\VerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Mail;

class VerifyListener
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
    public function handle(VerifyEvent $event): void
    {
        Mail::to($event->user['email'])->send(new VerifyEmail($event->user));

    }
}
