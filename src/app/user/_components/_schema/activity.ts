// src/app/_components/_schema/activity.ts

export interface SportActivity {
    id: number;
    title: string;
    address: string;
    activity_date: string;
    description: string;
    price: number;
    price_discount: number;
    slot: number;
    start_time: string;
    end_time: string;
    organizer: {
      name: string;
    };
  }