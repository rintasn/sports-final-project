import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import { SportActivity } from "./_schema/activity";

interface ActivityDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedActivity: SportActivity | null;
}

export default function ActivityDetailDrawer({ isOpen, onOpenChange, selectedActivity }: ActivityDetailDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Activity Detail</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {selectedActivity && (
            <>
              <h3>{selectedActivity.title}</h3>
              <p>{selectedActivity.description}</p>
              <p>Price: {selectedActivity.price}</p>
              <p>Discounted Price: {selectedActivity.price_discount}</p>
              <p>Slots: {selectedActivity.slot}</p>
              <p>Address: {selectedActivity.address}</p>
              <p>Activity Date: {selectedActivity.activity_date}</p>
              <p>Start Time: {selectedActivity.start_time}</p>
              <p>End Time: {selectedActivity.end_time}</p>
              <p>Organizer: {selectedActivity.organizer.name}</p>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}