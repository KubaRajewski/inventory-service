import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ComingSoonCard({
                                           title,
                                           description,
                                       }: {
    title: string;
    description: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{title}</CardTitle>
                <Badge variant="outline">Coming soon</Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
        </Card>
    );
}
