import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify  
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify  

// Zod Schema for Transaction Creation  
const TransactionSchema = z.object({
    sport_activity_id: z.number().min(1, "Sport activity is required"),
    payment_method_id: z.number().min(1, "Payment method is required")
})

type TransactionFormData = z.infer<typeof TransactionSchema>

interface TransactionDrawerProps {
    onTransactionCreated: () => void
}

const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ onTransactionCreated }) => {
    const [sportActivities, setSportActivities] = useState<any[]>([])
    const [paymentMethods, setPaymentMethods] = useState<any[]>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            sport_activity_id: undefined,
            payment_method_id: undefined
        }
    })

    const fetchSportActivities = async () => {
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id"
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN')

        try {
            const response = await fetch(`${BASE_URL}/api/v1/sport-activities?is_paginate=false&per_page=10&page=1`, {
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            setSportActivities(data.result)
        } catch (error) {
            console.error("Failed to fetch sport activities", error)
            toast.error("Failed to fetch sport activities", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const fetchPaymentMethods = async () => {
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id"
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN')

        try {
            const response = await fetch(`${BASE_URL}/api/v1/payment-methods`, {
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            setPaymentMethods(data.result)
        } catch (error) {
            console.error("Failed to fetch payment methods", error)
            toast.error("Failed to fetch payment methods", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    useEffect(() => {
        fetchSportActivities()
        fetchPaymentMethods()
    }, [])

    const onSubmit = async (data: TransactionFormData) => {
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id"
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN')

        try {
            const response = await fetch(`${BASE_URL}/api/v1/transaction/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!result.error) {
                toast.success(result.message, { // Display success toast  
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onTransactionCreated()
                setIsDrawerOpen(false)
            } else {
                toast.error(result.message, { // Display error toast  
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.error("Transaction creation failed", result.message)
            }
        } catch (error) {
            toast.error("Transaction creation error", { // Display error toast  
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error("Transaction creation error", error)
        }
    }

    return (
        <>
            <ToastContainer /> {/* Add ToastContainer here */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Recent Transactions</h2>
                        <Button className="mb-4" variant="outline">Create New Transaction</Button>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create New Transaction</DrawerTitle>
                        <DrawerDescription>Select sport activity and payment method</DrawerDescription>
                    </DrawerHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
                            <FormField
                                control={form.control}
                                name="sport_activity_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sport Activity</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a sport activity" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sportActivities.map((activity) => (
                                                    <SelectItem
                                                        key={activity.id}
                                                        value={activity.id.toString()}
                                                    >
                                                        {activity.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payment_method_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a payment method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {paymentMethods.map((method) => (
                                                    <SelectItem
                                                        key={method.id}
                                                        value={method.id.toString()}
                                                    >
                                                        {method.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DrawerFooter>
                                <Button type="submit">Create Transaction</Button>
                                <DrawerClose>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default TransactionDrawer  
