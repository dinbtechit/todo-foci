'use client';
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAtom} from "jotai";
import {isLoggedInState} from "@/components/user/state/user-state";

export default function Login() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [, setLoggedin] = useAtom(isLoggedInState)

    const login = async () => {
        if (!email) {
            setError("Please enter your email");
        } else {
            setError("");

            // Get user Details
            try {
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: email.toLowerCase()}),
                })
                const data = await response.json()
                if (data) {
                    setLoggedin(true);
                    router.push('/home');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred');
            }
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-full w-full">
            <Card className="flex flex-col h-auto">
                <CardHeader>
                    <CardTitle>
                        <h1>Login or Register</h1>
                        <hr className="mt-8"/>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-start space-y-2">
                    <small className="text-gray-500">One form to login & register!!</small>
                    <span className="text-sm font-semibold text-gray-500">Accepted Characters:</span>
                    <ul className="text-sm text-gray-500/90 list-disc">
                        <ol> - Max 8 characters</ol>
                        <ol> - Alpha-Numeric, special characters, even emoji&#39;s 🎉</ol>
                        <ol> - lowercase only</ol>
                    </ul>
                    <hr className="w-full"/>

                    <span>Username:</span>
                    <Input
                        className="lowercase"
                        maxLength={8}
                        placeholder="Enter username"
                        value={email}
                        onKeyDown={(e) => e.key === "Enter" && login()}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <span className="text-red-500">{error}</span>}
                </CardContent>
                <CardFooter>
                    <Button className="bg-primary hover:bg-primary/95 w-full"
                            onClick={() => login()}>Login or Register</Button>
                </CardFooter>
            </Card>
        </div>
    );
}