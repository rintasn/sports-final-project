interface Venue {
    id: number;
    sport_category_id: number;
    city_id: number;
    user_id: number;
    title: string;
    price: number;
    price_discount: number;
    slot: number;
    address: string;
    activity_date: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    organizer: {
      id: number;
      name: string;
      email: string;
    };
    city: {
      city_id: number;
      province_id: number;
      city_name: string;
      city_name_full: string;
      city_type: string;
      city_lat: number | null;
      city_lon: number | null;
      province: {
        province_id: number;
        province_name: string;
        province_name_abbr: string;
        province_name_id: string;
        province_name_en: string;
        province_capital_city_id: number;
        iso_code: string;
        iso_name: string;
        iso_type: string;
        iso_geounit: string;
        timezone: number;
        province_lat: number;
        province_lon: number;
      };
    };
    sport_category: {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
    };
    participants: Array<{
      id: number;
      sport_activity_id: number;
      user_id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
    }>;
  }
  