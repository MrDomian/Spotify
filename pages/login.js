import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const ERROR_MESSAGES = {
    OAuthSignin: "Nie udało się połączyć ze Spotify.",
    OAuthCallback: "Błąd podczas logowania — sprawdź Redirect URI w Spotify Dashboard.",
    OAuthCreateAccount: "Nie udało się utworzyć sesji.",
    AccessDenied: "Dostęp odrzucony.",
    Configuration:
        "Błąd konfiguracji serwera — sprawdź NEXTAUTH_URL, JWT_SECRET i dane Spotify w Vercel.",
    Default: "Wystąpił błąd logowania. Spróbuj ponownie.",
};

function Login() {
    const router = useRouter();
    const error = router.query.error;
    const errorMessage = error
        ? ERROR_MESSAGES[error] || ERROR_MESSAGES.Default
        : null;

    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center px-4">
            <img
                className="w-52 mb-5"
                src="https://links.papareact.com/9xl"
                alt=""
            />
            {errorMessage && (
                <p className="text-red-400 text-center mb-6 max-w-md">
                    {errorMessage}
                </p>
            )}
            <button
                className="bg-[#18D860] text-white p-5 rounded-full"
                onClick={() => signIn("spotify", { callbackUrl: "/" })}
            >
                Login with Spotify
            </button>
        </div>
    );
}

export default Login;
