import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Profile {
  id: string;
  tshirt_size?: string | null;
  formal_size?: string | null;
  shoe_size?: string | null;
  uniform_issued?: boolean | null;
  deposit_paid?: boolean | null;
  // Other profile properties
}

interface WardrobeTabProps {
  profile: Profile;
}

export const WardrobeTab: React.FC<WardrobeTabProps> = ({ profile }) => {
  // For demo purposes, adding mock wardrobe data since it might not be in the profile yet
  const wardrobeInfo = {
    tshirt_size: profile.tshirt_size || "Medium",
    formal_size: profile.formal_size || "8",
    shoe_size: profile.shoe_size || "7.5",
    uniform_issued: profile.uniform_issued !== undefined ? profile.uniform_issued : true,
    deposit_paid: profile.deposit_paid !== undefined ? profile.deposit_paid : true,
    items_assigned: [
      { id: 1, name: "Formal Dress", condition: "Excellent", date_issued: "2025-02-15" },
      { id: 2, name: "Performance Blazer", condition: "Good", date_issued: "2025-02-15" },
      { id: 3, name: "Club T-Shirt", condition: "New", date_issued: "2025-03-01" },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shirt className="h-5 w-5" /> Size Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">T-Shirt Size</p>
                <p className="font-medium">{wardrobeInfo.tshirt_size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Formal Dress/Blazer Size</p>
                <p className="font-medium">{wardrobeInfo.formal_size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shoe Size</p>
                <p className="font-medium">{wardrobeInfo.shoe_size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Uniform Issued</p>
                {wardrobeInfo.uniform_issued ? (
                  <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Yes</Badge>
                ) : (
                  <Badge variant="outline"><X className="h-3 w-3 mr-1" /> No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Deposit Paid</p>
                {wardrobeInfo.deposit_paid ? (
                  <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Yes</Badge>
                ) : (
                  <Badge variant="outline"><X className="h-3 w-3 mr-1" /> No</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Items</CardTitle>
        </CardHeader>
        <CardContent>
          {wardrobeInfo.items_assigned.length > 0 ? (
            <div className="space-y-4">
              {wardrobeInfo.items_assigned.map((item) => (
                <div key={item.id} className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.name}</h4>
                    <Badge>{item.condition}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Issued: {new Date(item.date_issued).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No items assigned yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Care Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Formal Dress / Blazer</h4>
              <p className="text-sm text-muted-foreground">Dry clean only. Do not iron directly on embroidery.</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Performance Accessories</h4>
              <p className="text-sm text-muted-foreground">Store in provided garment bag. Keep away from direct sunlight.</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">T-Shirts</h4>
              <p className="text-sm text-muted-foreground">Machine wash cold, tumble dry low. Do not bleach.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
