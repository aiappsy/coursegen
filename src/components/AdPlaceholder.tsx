import { Card, CardContent, CardHeader } from './ui/card';

const AdPlaceholder = () => {
    return (
        <Card className="w-full bg-gray-100 border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
                <p className="text-center text-xl font-semibold text-gray-700">
                    Your AD will be displayed here
                </p>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-32 md:h-48 bg-gray-200 border-t border-gray-300">
                <p className="text-center text-sm text-gray-500">
                    Placeholder for advertisements. The ad will be displayed here.
                </p>
            </CardContent>
        </Card>
    );
};

export default AdPlaceholder;
