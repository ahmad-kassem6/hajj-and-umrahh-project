<?php

namespace App\Services\Auth;

use App\Enums\OTPMailType;
use App\Exceptions\VerificationException;
use App\Mail\OTPMail;
use App\Models\User;
use App\Models\Verification;
use Exception;
use Illuminate\Support\Facades\Mail;
use Random\RandomException;

class OTPService
{
    /**
     * @throws Exception
     */
    public function create(User $user, OTPMailType $OTPMailType, string $newContact = null): void
    {
        $user->verification()?->delete();
        try {
            $code = random_int(100000, 999999);
        } catch (RandomException) {
            throw VerificationException::somethingWentWrong();
        }
        $user->verification()->create([
            'code' => $code,
            'new_contact' => $newContact,
        ]);
        Mail::to($user->contact)->send(new OTPMail($user->name, $user->contact, $code, $OTPMailType));
    }

    /**
     * @throws VerificationException
     */
    public function verify(User $user, string $code): void
    {
        if (!$this->check($user, $code)) {
            throw VerificationException::invalidCode();
        }
        if (!$this->checkNewContact($user->verification)) {
            $user->verification()?->delete();
            throw VerificationException::invalidContact();
        }
        $user->verification()?->delete();
    }

    public function check(User $user, string $code): bool
    {
        $verification = $user->verification;
        if (!$verification || $verification->code !== $code || $verification->created_at->diffInMinutes(now()) > 5) {
            return false;
        }
        return true;
    }

    private function checkNewContact(Verification $verification): bool
    {
        if (isset($verification->new_contact) && User::where('contact', $verification->new_contact)->exists()) {
            return false;
        }
        return true;
    }
}
