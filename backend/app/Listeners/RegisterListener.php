<?php

namespace App\Listeners;

use App\Events\RegisterEvent;
use App\Mail\WelcomeToLafetaa;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Mail;

class RegisterListener
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
        Mail::to($event->user['email'])->send(new WelcomeToLafetaa($event->user));
    }
}
