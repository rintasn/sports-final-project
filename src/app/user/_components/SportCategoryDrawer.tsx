import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";    
import { useState, useEffect } from 'react';    
import { SportCategory } from "./_schema/category";    
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";    
import { Button } from "@/components/ui/button"    
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";    
import { format } from 'date-fns';    
  
interface SportCategoryDrawerProps {    
    isOpen: boolean;    
    onOpenChange: (open: boolean) => void;    
}    
  
export default function SportCategoryDrawer({ isOpen, onOpenChange }: SportCategoryDrawerProps) {    
    const [sportCategories, setSportCategories] = useState<SportCategory[]>([]);    
    const [searchTerm, setSearchTerm] = useState('');    
    const [error, setError] = useState<string | null>(null);    
    const [successMessage, setSuccessMessage] = useState<string | null>(null);    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);    
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);    
    const [newCategoryName, setNewCategoryName] = useState('');    
    const [editingCategory, setEditingCategory] = useState<SportCategory | null>({    
        id: 0,    
        name: '',    
        created_at: '',    
        updated_at: '',    
    });    
    const [currentPage, setCurrentPage] = useState(1);    
    const [totalPages, setTotalPages] = useState(1);    
    const [paginationLinks, setPaginationLinks] = useState<{ url: string | null, label: string, active: boolean }[]>([]);    
  
    useEffect(() => {    
        if (editingCategory === null) {    
            setEditingCategory({    
                id: 0,    
                name: '',    
                created_at: '',    
                updated_at: '',    
            });    
        }    
    }, [editingCategory]);    
  
    const fetchSportCategories = async (page: number) => {    
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";    
        const API_ENDPOINT = `/api/v1/sport-categories?is_paginate=true&per_page=10&page=${page}&search=${searchTerm}`;    
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');    
  
        if (!BEARER_TOKEN) {    
            setError("Bearer token not found in localStorage.");    
            return;    
        }    
  
        try {    
            const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {    
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
  
            setSportCategories(data.result.data);    
            setCurrentPage(data.result.current_page);    
            setTotalPages(data.result.last_page);    
            setPaginationLinks(data.result.links.map((link: { url: string | null, label: string, active: boolean }) => ({
              ...link,
              url: link.url ? link.url.replace('http://localhost:4030/api/v1/sport-categories', BASE_URL + '/api/v1/sport-categories') : null,
            })));    
        } catch (err) {    
            setError(err instanceof Error ? err.message : "An unknown error occurred.");    
        }    
    };    
  
    useEffect(() => {    
        if (isOpen) {    
            fetchSportCategories(currentPage);    
        }    
    }, [isOpen, currentPage, searchTerm]);    
  
    const handleAddCategory = async () => {    
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";    
        const API_ENDPOINT = `/api/v1/sport-categories/create`;    
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');    
  
        if (!BEARER_TOKEN) {    
            setError("Bearer token not found in localStorage.");    
            return;    
        }    
  
        try {    
            const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {    
                method: 'POST',    
                headers: {    
                    'Authorization': `Bearer ${BEARER_TOKEN}`,    
                    'Content-Type': 'application/json',    
                },    
                body: JSON.stringify({ name: newCategoryName }),    
            });    
  
            if (!response.ok) {    
                throw new Error(`HTTP error! Status: ${response.status}`);    
            }    
  
            const data = await response.json();    
            if (data.error) {    
                throw new Error(data.message || "An error occurred while adding data.");    
            }    
  
            setSportCategories([...sportCategories, data.result]);    
            setIsAddDialogOpen(false);    
            setNewCategoryName('');    
            setSuccessMessage('Success: Category added!');    
            setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds    
        } catch (err) {    
            setError(err instanceof Error ? err.message : "An unknown error occurred.");    
        }    
    };    
  
    const handleUpdateCategory = async () => {    
        if (!editingCategory) return;    
  
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";    
        const API_ENDPOINT = `/api/v1/sport-categories/update/${editingCategory.id}`;    
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');    
  
        if (!BEARER_TOKEN) {    
            setError("Bearer token not found in localStorage.");    
            return;    
        }    
  
        try {    
            const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {    
                method: 'POST',    
                headers: {    
                    'Authorization': `Bearer ${BEARER_TOKEN}`,    
                    'Content-Type': 'application/json',    
                },    
                body: JSON.stringify({ name: editingCategory.name }),    
            });    
  
            if (!response.ok) {    
                throw new Error(`HTTP error! Status: ${response.status}`);    
            }    
  
            const data = await response.json();    
            if (data.error) {    
                throw new Error(data.message || "An error occurred while updating data.");    
            }    
  
            setSportCategories(sportCategories.map(category =>    
                category.id === editingCategory.id ? data.result : category    
            ));    
            setIsEditDialogOpen(false);    
            setEditingCategory({    
                id: 0,    
                name: '',    
                created_at: '',    
                updated_at: '',    
            });    
            setSuccessMessage('Success: Category updated!');    
            setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds    
        } catch (err) {    
            setError(err instanceof Error ? err.message : "An unknown error occurred.");    
        }    
    };    
  
    const handleDeleteCategory = async (categoryId: number) => {    
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";    
        const API_ENDPOINT = `/api/v1/sport-categories/delete/${categoryId}`;    
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');    
  
        if (!BEARER_TOKEN) {    
            setError("Bearer token not found in localStorage.");    
            return;    
        }    
  
        try {    
            const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {    
                method: 'DELETE',    
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
                throw new Error(data.message || "An error occurred while deleting data.");    
            }    
  
            setSportCategories(sportCategories.filter(category => category.id !== categoryId));    
            setSuccessMessage('Success: Category deleted!');    
            setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds    
        } catch (err) {    
            setError(err instanceof Error ? err.message : "An unknown error occurred.");    
        }    
    };    
  
    const formatDate = (dateString: string) => {    
        const date = new Date(dateString);    
        return format(date, 'yyyy-MM-dd HH:mm:ss');    
    };    
  
    const handlePageChange = (page: number) => {    
        if (page >= 1 && page <= totalPages) {    
            setCurrentPage(page);    
        }    
    };    
  
    return (    
        <Drawer open={isOpen} onOpenChange={onOpenChange}>    
            <DrawerContent>    
                <DrawerHeader>    
                    <DrawerTitle>Sport Categories</DrawerTitle>    
                </DrawerHeader>    
                <div className="p-4">    
                    {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{successMessage}</div>}    
                    {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>}    
                    <input    
                        type="text"    
                        placeholder="Search..."    
                        value={searchTerm}    
                        onChange={(e) => setSearchTerm(e.target.value)}    
                        className="mb-4 p-2 border rounded"    
                    />    
                    <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">Add New Category</Button>    
  
                    <div className="overflow-y-auto max-h-[60vh]"> {/* Scrollable content */}    
                        {sportCategories.map(category => (    
                            <Card    
                                key={category.id}    
                                className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors"    
                            >    
                                <CardHeader>    
                                    <CardTitle>{category.name}</CardTitle>    
                                    <CardDescription>Updated At: {formatDate(category.updated_at)}</CardDescription>    
                                </CardHeader>    
                                <CardContent>    
                                    <Button variant="default" onClick={() => {    
                                        setEditingCategory(category);    
                                        setIsEditDialogOpen(true);    
                                    }} className="mr-2">Edit</Button>    
                                    <Button variant="destructive" onClick={() => {    
                                        if (window.confirm('Are you sure you want to delete this category?')) {    
                                            handleDeleteCategory(category.id);    
                                        }    
                                    }}>Delete</Button>    
                                </CardContent>    
                            </Card>    
                        ))}    
                    </div>    
  
                    <div className="flex justify-center mt-4">    
                        {paginationLinks.map((link, index) => (    
                            <Button    
                                key={index}    
                                onClick={() => link.url && handlePageChange(parseInt(link.label, 10))}    
                                disabled={link.active || !link.url}    
                                className={`mx-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}    
                            >    
                                {link.label}    
                            </Button>    
                        ))}    
                    </div>    
                </div>    
            </DrawerContent>    
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>    
                <DialogContent>    
                    <DialogHeader>    
                        <DialogTitle>Add New Category</DialogTitle>    
                    </DialogHeader>    
                    <DialogDescription>    
                        <input    
                            type="text"    
                            placeholder="Category Name"    
                            value={newCategoryName}    
                            onChange={(e) => setNewCategoryName(e.target.value)}    
                            className="mb-4 p-2 border rounded"    
                        />    
                    </DialogDescription>    
                    <DialogFooter>    
                        <Button onClick={handleAddCategory}>Add</Button>    
                        <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>    
                    </DialogFooter>    
                </DialogContent>    
            </Dialog>    
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>    
                <DialogContent>    
                    <DialogHeader>    
                        <DialogTitle>Edit Category</DialogTitle>    
                    </DialogHeader>    
                    <DialogDescription>    
                        <input    
                            type="text"    
                            placeholder="Category Name"    
                            value={editingCategory?.name || ''}    
                            onChange={(e) => {    
                                if (editingCategory) {    
                                    setEditingCategory({ ...editingCategory, name: e.target.value });    
                                }    
                            }}    
                            className="mb-4 p-2 border rounded"    
                        />    
                    </DialogDescription>    
                    <DialogFooter>    
                        <Button onClick={handleUpdateCategory}>Update</Button>    
                        <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>    
                    </DialogFooter>    
                </DialogContent>    
            </Dialog>    
        </Drawer>    
    );    
}  
