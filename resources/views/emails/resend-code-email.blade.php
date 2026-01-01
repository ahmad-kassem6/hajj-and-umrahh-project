<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Resend Verification Code</title>
    <link
        href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
        rel="stylesheet" media="screen">
    <style>
        @media (max-width: 600px) {
            .sm-w-full {
                width: 100% !important;
            }

            .sm-px-24 {
                padding-left: 24px !important;
                padding-right: 24px !important;
            }

            .sm-py-32 {
                padding-top: 32px !important;
                padding-bottom: 32px !important;
            }

            .sm-leading-32 {
                line-height: 32px !important;
            }
        }

        /* Reset styles for email compatibility */
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            word-break: break-word;
            -webkit-font-smoothing: antialiased;
            background-color: #f4f6f8;
            font-family: 'Montserrat', sans-serif;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        .hover-underline:hover {
            text-decoration: underline !important;
        }

        .email-background {
            background: url({{asset('/storage/Images/hajjandumrah.webp')}}) no-repeat center center;
            background-size: cover;
        }
    </style>
</head>
<body>
<div role="article" aria-roledescription="email" aria-label="Resend Verification Code" lang="en">
    <table role="presentation" cellpadding="0" cellspacing="0" class="email-background"
           style="width: 100%; height: 100%;">
        <tr>
            <td align="center" style="padding: 48px;">
                <table cellpadding="0" cellspacing="0" role="presentation" style="width: 600px; max-width: 100%;"
                       class="sm-w-full">
                    <tr>
                        <td class="sm-py-32 sm-px-24"
                            style="background-color: #ffffff; padding: 48px; border-radius: 4px; text-align: left;">
                            <p style="font-size: 20px; font-weight: 600; color: #555; margin: 0;">
                                Hello again, <span style="color: #87674f; font-weight: 700;">{{$name}}</span>!
                            </p>
                            <p style="font-size: 24px; font-weight: 600; color: #263238; margin-top: 16px; margin-bottom: 16px;">
                                We noticed you need a new verification code. 👋
                            </p>
                            <p style="color: #555; margin-bottom: 24px;">
                                Please verify your email address by copying and pasting the new code below into the
                                confirmation modal.
                            </p>
                            <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin: 0 0 10px; font-weight: 600; color: #626262;">
                                NEW VERIFICATION CODE:
                            </p>
                            <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin: 0 0 16px; font-weight: 550; color: #87674f; background-color: #f4f4f7; padding: 10px 5px; border-radius: 5px; text-align: center; letter-spacing: 7px;">
                                {{$code}}
                            </p>
                            <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin: 0 0 10px; font-weight: 600; color: #626262;">
                                ACCOUNT DETAILS:
                            </p>
                            <p style="color: #555; margin: 0;">
                                Name: {{$name}}<br/>
                                Email: {{$email}}
                            </p>
                            <hr style="margin: 32px 0; border: none; height: 1px; background-color: #eceff1;">
                            <p style="margin-top: 32px; color: #555;">
                                If you did not sign up or no longer need to verify your email, please ignore this
                                message.
                            </p>
                            <p style="color: #555; margin: 0;">
                                Thanks, <br> Islamic Cultural Tourism Team
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
</body>
</html>
