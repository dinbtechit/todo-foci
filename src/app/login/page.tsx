import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
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
                    <span>Email:</span>
                    <Input placeholder="Enter your E-mail"/>
                </CardContent>
                <CardFooter>
                    <Link href="/" className="w-full">
                        <Button className="bg-primary hover:bg-primary/95 w-full">Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}