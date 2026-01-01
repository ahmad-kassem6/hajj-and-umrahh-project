<?php

namespace App\Enums;

enum OTPMailType: string
{
    case SIGNUP = 'Confirm your email address';
    case RESEND_CODE = 'Resend code';
    case RESET_PASSWORD = 'Reset password';
}
