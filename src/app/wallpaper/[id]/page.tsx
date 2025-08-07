
'use client';

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function WallpaperDetailPage() {
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl text-glow flex items-center gap-3">
                            Page Removed
                        </CardTitle>
                         <CardDescription className="mt-2">
                            This page is no longer in use. You can download and favorite wallpapers directly from the main screen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go back to Home
                            </Link>
                       </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
