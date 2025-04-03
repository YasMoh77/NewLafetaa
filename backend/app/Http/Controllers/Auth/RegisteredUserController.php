<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Events\RegisterEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)//: Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255' ,'min:5'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([ 
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
            
        
        event(new RegisterEvent($user));

       // Auth::login($user);

      //  return response()->noContent();*/
        return response()->json([
            'message'=>'تم التسجيل بنجاح',
            'name'=>$user['name'],
            'email'=>$user['email']
        ]);
    }
}
