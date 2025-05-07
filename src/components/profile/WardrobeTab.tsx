
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/hooks/useUserManagement";
import { Shirt, Check, X } from "lucide-react";

interface WardrobeTabProps {
  profile: User;
}

// This would normally come from the database
interface WardrobeInfo {
  tShirtSize: string;
  dressSize: string;
  shoeSize: string;
  uniformIssued: boolean;
  depositPaid: boolean;
}

export function WardrobeTab({ profile }: WardrobeTabProps) {
  // Mock wardrobe info - in a real app, this would come from the database
  const wardrobeInfo: WardrobeInfo = {
    tShirtSize: "M",
    dressSize: "8",
    shoeSize: "7.5",
    uniformIssued: true,
    depositPaid: true
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sizes Information</CardTitle>
          <CardDescription>
            Your clothing sizes for uniform orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">T-Shirt Size</h3>
              <div className="flex items-center">
                <Shirt className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{wardrobeInfo.tShirtSize}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Blazer/Dress Size</h3>
              <p>{wardrobeInfo.dressSize}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Shoe Size</h3>
              <p>{wardrobeInfo.shoeSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Uniform Status</CardTitle>
          <CardDescription>
            Uniform issuance and deposit information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Uniform Issued</h3>
              <div className="flex items-center">
                {wardrobeInfo.uniformIssued ? (
                  <>
                    <Badge className="bg-green-500 mr-2">Yes</Badge>
                    <Check className="h-4 w-4 text-green-500" />
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="mr-2">No</Badge>
                    <X className="h-4 w-4 text-red-500" />
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Deposit Paid</h3>
              <div className="flex items-center">
                {wardrobeInfo.depositPaid ? (
                  <>
                    <Badge className="bg-green-500 mr-2">Yes</Badge>
                    <Check className="h-4 w-4 text-green-500" />
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="mr-2">No</Badge>
                    <X className="h-4 w-4 text-red-500" />
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border rounded-md bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Uniform Details</h3>
            <p className="text-sm text-muted-foreground">
              Full concert uniform includes black dress or blazer with white shirt, black shoes, 
              and Glee Club pin. Return all items at the end of the academic year.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Uniform Record</CardTitle>
          <CardDescription>
            History of uniform issuance and returns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Concert Uniform Issued</p>
                  <p className="text-sm text-muted-foreground">September 10, 2024</p>
                </div>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Casual Uniform Issued</p>
                  <p className="text-sm text-muted-foreground">August 25, 2024</p>
                </div>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
