import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Package,
  Save,
  Download,
  FileText,
  Sparkles,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/utils/permissionChecker";
import {
  generatePackingSheetHTML,
  downloadPDF,
  type PackingSheetData,
} from "@/utils/pdfGenerator";

interface StoreItem {
  id: string;
  name: string;
  price: number;
  quantity_in_stock: number;
  tags: string[];
  is_active: boolean;
}

interface TourMerchAssignment {
  id: string;
  event_id: string;
  item_id: string;
  assigned_quantity: number;
  notes: string;
  created_by: string;
  created_at: string;
}

interface AISuggestion {
  itemId: string;
  suggestedQuantity: number;
  confidence: string;
  reasoning: string;
  riskLevel: string;
}

interface TourMerchAssignmentProps {
  eventId: string;
  eventTitle?: string;
  expectedAttendance?: number;
  venueType?: string;
}

export const TourMerchAssignment: React.FC<TourMerchAssignmentProps> = ({
  eventId,
  eventTitle = "Event",
  expectedAttendance = 100,
  venueType = "general",
}) => {
  const { user, profile } = useAuth();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [assignments, setAssignments] = useState<TourMerchAssignment[]>([]);
  const [editingQuantities, setEditingQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>(
    {},
  );
  const [aiSuggestions, setAiSuggestions] = useState<{
    [key: string]: AISuggestion;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Check permissions
  const canManageTourMerch = () => {
    if (!user || !profile) return false;

    const currentUser = {
      ...user,
      role_tags: profile?.role_tags || [],
    };

    return (
      hasPermission(currentUser, "manage_shop") ||
      profile?.role_tags?.includes("Tour Manager") ||
      profile?.role_tags?.includes("Merchandise Manager") ||
      profile?.is_super_admin
    );
  };

  const canEdit = canManageTourMerch();

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch active store items
      const { data: items, error: itemsError } = await supabase
        .from("store_items")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (itemsError) throw itemsError;

      // Fetch existing assignments for this event
      const { data: existingAssignments, error: assignmentsError } =
        await supabase
          .from("tour_merch_assignments")
          .select("*")
          .eq("event_id", eventId);

      if (assignmentsError) throw assignmentsError;

      setStoreItems(items || []);
      setAssignments(existingAssignments || []);

      // Initialize editing states
      const quantities: { [key: string]: number } = {};
      const notes: { [key: string]: string } = {};

      (existingAssignments || []).forEach((assignment) => {
        quantities[assignment.item_id] = assignment.assigned_quantity;
        notes[assignment.item_id] = assignment.notes || "";
      });

      setEditingQuantities(quantities);
      setEditingNotes(notes);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load tour merch data");
    } finally {
      setIsLoading(false);
    }
  };

  const getAISuggestions = async () => {
    setIsLoadingAI(true);
    try {
      const response = await supabase.functions.invoke("ai-merch-suggester", {
        body: {
          eventId,
          items: storeItems,
          eventDetails: {
            expectedAttendance,
            venueType,
            eventTitle,
          },
        },
      });

      if (response.error) throw response.error;

      const suggestions: { [key: string]: AISuggestion } = {};
      response.data.suggestions.forEach((suggestion: AISuggestion) => {
        suggestions[suggestion.itemId] = suggestion;
      });

      setAiSuggestions(suggestions);
      toast.success("AI suggestions loaded successfully");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get AI suggestions");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applyAISuggestion = (itemId: string) => {
    const suggestion = aiSuggestions[itemId];
    if (suggestion) {
      setEditingQuantities((prev) => ({
        ...prev,
        [itemId]: suggestion.suggestedQuantity,
      }));
      toast.success("AI suggestion applied");
    }
  };

  const exportPackingSheet = () => {
    const assignedItems = storeItems
      .filter((item) => (editingQuantities[item.id] || 0) > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        assignedQuantity: editingQuantities[item.id] || 0,
        price: item.price,
        tags: item.tags,
        notes: editingNotes[item.id] || "",
      }));

    const packingData: PackingSheetData = {
      eventTitle,
      eventDate: new Date().toLocaleDateString(),
      eventLocation: "Venue Location", // You might want to fetch this from event data
      expectedAttendance,
      items: assignedItems,
      totalItems: assignedItems.reduce(
        (sum, item) => sum + item.assignedQuantity,
        0,
      ),
      totalValue: assignedItems.reduce(
        (sum, item) => sum + item.assignedQuantity * item.price,
        0,
      ),
    };

    const htmlContent = generatePackingSheetHTML(packingData);
    downloadPDF(
      htmlContent,
      `packing-sheet-${eventTitle.replace(/\s+/g, "-")}.pdf`,
    );
  };

  const calculateSuggestedQuantity = (item: StoreItem): number => {
    // Merch affinity factors based on item tags/type
    let affinityFactor = 0.25; // Default for large items

    if (item.tags.includes("CD") || item.tags.includes("music")) {
      affinityFactor = 0.4;
    } else if (item.tags.includes("sticker") || item.tags.includes("small")) {
      affinityFactor = 0.6;
    } else if (
      item.tags.includes("clothing") ||
      item.tags.includes("apparel")
    ) {
      affinityFactor = 0.3;
    }

    // Availability factor - reduce if stock is low
    let availabilityFactor = 1.0;
    if (item.quantity_in_stock < 20) {
      availabilityFactor = 0.5;
    } else if (item.quantity_in_stock < 50) {
      availabilityFactor = 0.75;
    }

    // Venue type modifier
    let venueModifier = 1.0;
    if (venueType === "university" || venueType === "college") {
      venueModifier = 1.2;
    } else if (venueType === "church") {
      venueModifier = 0.8;
    }

    const suggested = Math.round(
      expectedAttendance * affinityFactor * availabilityFactor * venueModifier,
    );

    return Math.min(suggested, item.quantity_in_stock);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setEditingQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, quantity),
    }));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setEditingNotes((prev) => ({
      ...prev,
      [itemId]: notes,
    }));
  };

  const saveAssignment = async (itemId: string) => {
    if (!canEdit) {
      toast.error("You do not have permission to edit assignments");
      return;
    }

    setIsSaving(true);
    try {
      const quantity = editingQuantities[itemId] || 0;
      const notes = editingNotes[itemId] || "";

      if (quantity === 0) {
        // Remove assignment if quantity is 0
        await supabase
          .from("tour_merch_assignments")
          .delete()
          .eq("event_id", eventId)
          .eq("item_id", itemId);
      } else {
        // Upsert assignment
        await supabase.from("tour_merch_assignments").upsert({
          event_id: eventId,
          item_id: itemId,
          assigned_quantity: quantity,
          notes: notes,
          created_by: user?.id,
        });
      }

      toast.success("Assignment saved successfully");
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to save assignment");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAllAssignments = async () => {
    if (!canEdit) {
      toast.error("You do not have permission to edit assignments");
      return;
    }

    setIsSaving(true);
    try {
      const upsertData = Object.entries(editingQuantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => ({
          event_id: eventId,
          item_id: itemId,
          assigned_quantity: quantity,
          notes: editingNotes[itemId] || "",
          created_by: user?.id,
        }));

      if (upsertData.length > 0) {
        await supabase.from("tour_merch_assignments").upsert(upsertData);
      }

      // Remove assignments with 0 quantity
      const zeroQuantityItems = Object.entries(editingQuantities)
        .filter(([_, quantity]) => quantity === 0)
        .map(([itemId]) => itemId);

      if (zeroQuantityItems.length > 0) {
        await supabase
          .from("tour_merch_assignments")
          .delete()
          .eq("event_id", eventId)
          .in("item_id", zeroQuantityItems);
      }

      toast.success("All assignments saved successfully");
      await fetchData();
    } catch (error) {
      console.error("Error saving assignments:", error);
      toast.error("Failed to save assignments");
    } finally {
      setIsSaving(false);
    }
  };

  const exportAssignments = () => {
    const assignmentData = storeItems
      .filter((item) => (editingQuantities[item.id] || 0) > 0)
      .map((item) => ({
        "Item Name": item.name,
        "Assigned Quantity": editingQuantities[item.id] || 0,
        Price: `$${item.price}`,
        "Total Value": `$${((editingQuantities[item.id] || 0) * item.price).toFixed(2)}`,
        Notes: editingNotes[item.id] || "",
      }));

    const csvContent = [
      ["Tour Merch Assignment", eventTitle].join(","),
      ["Event ID", eventId].join(","),
      ["Expected Attendance", expectedAttendance].join(","),
      ["Generated", new Date().toLocaleString()].join(","),
      "",
      Object.keys(assignmentData[0] || {}).join(","),
      ...assignmentData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tour-merch-${eventTitle.replace(/\s+/g, "-")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTotalAssigned = () => {
    return Object.values(editingQuantities).reduce(
      (sum, qty) => sum + (qty || 0),
      0,
    );
  };

  const getTotalValue = () => {
    return storeItems.reduce((sum, item) => {
      const quantity = editingQuantities[item.id] || 0;
      return sum + quantity * item.price;
    }, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading tour merch assignments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Tour Merch Assignment - {eventTitle}
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Expected Attendance: {expectedAttendance}</span>
            <span>Venue Type: {venueType}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {getTotalAssigned()}
              </div>
              <div className="text-sm text-blue-600">Total Items Assigned</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${getTotalValue().toFixed(2)}
              </div>
              <div className="text-sm text-green-600">
                Total Assignment Value
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  storeItems.filter(
                    (item) => (editingQuantities[item.id] || 0) > 0,
                  ).length
                }
              </div>
              <div className="text-sm text-yellow-600">
                Items with Assignments
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {canEdit && (
              <>
                <Button
                  onClick={saveAllAssignments}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save All Assignments
                </Button>
                <Button
                  variant="outline"
                  onClick={getAISuggestions}
                  disabled={isLoadingAI}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoadingAI
                    ? "Getting AI Suggestions..."
                    : "Get AI Suggestions"}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={exportAssignments}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={exportPackingSheet}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Packing Sheet
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item Name</th>
                  <th className="text-left p-2">Current Stock</th>
                  <th className="text-left p-2">Suggested</th>
                  <th className="text-left p-2">AI Suggestion</th>
                  <th className="text-left p-2">Assigned</th>
                  <th className="text-left p-2">Notes</th>
                  {canEdit && <th className="text-left p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {storeItems.map((item) => {
                  const suggestedQty = calculateSuggestedQuantity(item);
                  const assignedQty = editingQuantities[item.id] || 0;
                  const aiSuggestion = aiSuggestions[item.id];
                  const isLowStock = item.quantity_in_stock < 10;

                  return (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {item.name}
                          {isLowStock && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${item.price} • {item.tags.join(", ")}
                        </div>
                      </td>
                      <td className="p-2">
                        <span
                          className={
                            isLowStock ? "text-red-600 font-medium" : ""
                          }
                        >
                          {item.quantity_in_stock}
                        </span>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{suggestedQty}</Badge>
                      </td>
                      <td className="p-2">
                        {aiSuggestion ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {aiSuggestion.suggestedQuantity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {aiSuggestion.confidence}
                              </Badge>
                            </div>
                            {canEdit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => applyAISuggestion(item.id)}
                                className="text-xs h-6 px-2"
                              >
                                Apply
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max={item.quantity_in_stock}
                          value={assignedQty}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-20"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="p-2">
                        <Textarea
                          value={editingNotes[item.id] || ""}
                          onChange={(e) =>
                            handleNotesChange(item.id, e.target.value)
                          }
                          placeholder="Notes..."
                          className="min-h-[60px] w-full max-w-[200px]"
                          disabled={!canEdit}
                        />
                      </td>
                      {canEdit && (
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveAssignment(item.id)}
                            disabled={isSaving}
                            className="flex items-center gap-1"
                          >
                            <Save className="h-3 w-3" />
                            Save
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!canEdit && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  You have read-only access. Only Tour Managers, Merchandise
                  Managers, Treasurers, and Admins can edit assignments.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
