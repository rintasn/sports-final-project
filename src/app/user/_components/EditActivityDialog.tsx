// src/app/_components/EditActivityDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SportActivity } from "./_schema/activity";

interface EditActivityDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    activity: SportActivity | null;
    onSave: (updatedActivity: SportActivity) => void;
}

export default function EditActivityDialog({ isOpen, onOpenChange, activity, onSave }: EditActivityDialogProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        sport_category_id: activity?.sport_category_id || 1,
        city_id: activity?.city_id || 3172,
        title: activity?.title || "",
        description: activity?.description || "",
        slot: activity?.slot || 0,
        price: activity?.price || 0,
        address: activity?.address || "",
        activity_date: activity?.activity_date || "",
        start_time: activity?.start_time || "",
        end_time: activity?.end_time || "",
        map_url: activity?.map_url || "",
    });

    useEffect(() => {
        if (activity) {
            fetchActivityData(activity.id.toString()); // Konversi ke string
        }
    }, [activity]);

    const fetchActivityData = async (activityId: string) => { // Pastikan tipe parameter adalah string
        try {
            const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
            const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

            if (!BEARER_TOKEN) {
                toast({
                    title: "Error",
                    description: "Bearer token not found in localStorage.",
                    variant: "destructive",
                });
                return;
            }

            const response = await fetch(`${BASE_URL}/api/v1/sport-activities/${activityId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message || "An error occurred while fetching data.");
            }

            setFormData({
                sport_category_id: data.result.sport_category_id,
                city_id: data.result.city_id,
                title: data.result.title,
                description: data.result.description,
                slot: data.result.slot,
                price: data.result.price,
                address: data.result.address,
                activity_date: data.result.activity_date,
                start_time: data.result.start_time,
                end_time: data.result.end_time,
                map_url: data.result.map_url,
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "An unknown error occurred.",
                variant: "destructive",
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            // Validate start_time and end_time format  
            const startTimePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (!startTimePattern.test(formData.start_time)) {
                toast({
                    title: "Error",
                    description: "Start time must be in the format H:i (e.g., 13:45).",
                    variant: "destructive",
                });
                return;
            }

            if (!startTimePattern.test(formData.end_time)) {
                toast({
                    title: "Error",
                    description: "End time must be in the format H:i (e.g., 13:45).",
                    variant: "destructive",
                });
                return;
            }

            const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
            const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

            if (!BEARER_TOKEN) {
                toast({
                    title: "Error",
                    description: "Bearer token not found in localStorage.",
                    variant: "destructive",
                });
                return;
            }

            const response = await fetch(`${BASE_URL}/api/v1/sport-activities/update/${activity?.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message || "An error occurred while updating data.");
            }

            toast({
                title: "Success",
                description: "Activity updated successfully.",
            });

            onSave(data.result); // Panggil fungsi onSave untuk memperbarui state  
            onOpenChange(false); // Tutup dialog  
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "An unknown error occurred.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Activity</DialogTitle>
                    <DialogDescription>Update the details of this activity.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Slot</Label>
                        <Input
                            name="slot"
                            type="number"
                            value={formData.slot}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Price</Label>
                        <Input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Activity Date</Label>
                        <Input
                            name="activity_date"
                            type="date"
                            value={formData.activity_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Start Time</Label>
                        <Input
                            name="start_time"
                            type="time"
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>End Time</Label>
                        <Input
                            name="end_time"
                            type="time"
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Map URL</Label>
                        <Input
                            name="map_url"
                            value={formData.map_url}
                            onChange={handleChange}
                        />
                    </div>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}