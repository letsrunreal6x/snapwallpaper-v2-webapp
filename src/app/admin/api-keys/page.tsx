import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KeyRound, PlusCircle, RotateCw } from "lucide-react";

const apiServices = [
    { name: 'Pexels', key: 'PEX...-....-....-....-....', status: 'Active', expires: '30 days' },
    { name: 'Pixabay', key: 'PIX...-....-....-....-....', status: 'Active', expires: '85 days' },
    { name: 'Unsplash', key: 'UNS...-....-....-....-....', status: 'Rotating', expires: '2 hours' },
    { name: 'NASA', key: 'NAS...-....-....-....-....', status: 'Active', expires: 'N/A' },
];

export default function ApiKeysPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-headline text-3xl text-glow flex items-center gap-3">
                                    <KeyRound className="w-8 h-8 text-primary"/>
                                    API Key Management
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    Manage and rotate API keys to prevent service disruption.
                                </CardDescription>
                            </div>
                            <Button className="gap-2">
                                <PlusCircle className="w-4 h-4"/>
                                Add New Key
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-headline">Service</TableHead>
                                    <TableHead className="font-headline">API Key</TableHead>
                                    <TableHead className="font-headline">Status</TableHead>
                                    <TableHead className="font-headline">Expires In</TableHead>
                                    <TableHead className="text-right font-headline">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiServices.map((api) => (
                                    <TableRow key={api.name}>
                                        <TableCell className="font-medium">{api.name}</TableCell>
                                        <TableCell className="font-code text-muted-foreground">{api.key}</TableCell>
                                        <TableCell>
                                            <Badge variant={api.status === 'Active' ? 'default' : 'secondary'} className={api.status === 'Active' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 animate-pulse'}>
                                                {api.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{api.expires}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <RotateCw className="w-4 h-4 text-accent hover:text-primary transition-colors" />
                                                <span className="sr-only">Rotate Key</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
