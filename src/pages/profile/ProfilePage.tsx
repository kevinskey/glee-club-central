
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, AtSign, Phone, MapPin, School, Pencil, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VoicePart = "Soprano1" | "Soprano2" | "Alto1" | "Alto2" | "Tenor" | "Bass" | "not_specified";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [voicePart, setVoicePart] = useState<VoicePart>("not_specified");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFullName(data.full_name || '');
        setEmail(data.email || user.email || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setSchool(data.school || '');
        setBio(data.bio || '');
        // Convert null or empty voice part to "not_specified"
        setVoicePart((data.voice_part || "not_specified") as VoicePart);
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: "There was an error loading your profile information.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: email || user.email,
          phone,
          address,
          school,
          bio,
          voice_part: voicePart === "not_specified" ? null : voicePart,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and settings"
        icon={<UserRound className="h-6 w-6" />}
      />
      
      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{getInitials(fullName || "Glee Member")}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{fullName || "Set Your Name"}</CardTitle>
              <CardDescription>
                {voicePart === "not_specified" ? "Voice part not specified" : voicePart}
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="fullName">Full Name</label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">Email</label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      type="email"
                      disabled={!!user?.email}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="phone">Phone Number</label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="voicePart">Voice Part</label>
                    <Select
                      value={voicePart}
                      onValueChange={(value) => setVoicePart(value as VoicePart)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your voice part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_specified">Not specified</SelectItem>
                        <SelectItem value="Soprano1">Soprano 1</SelectItem>
                        <SelectItem value="Soprano2">Soprano 2</SelectItem>
                        <SelectItem value="Alto1">Alto 1</SelectItem>
                        <SelectItem value="Alto2">Alto 2</SelectItem>
                        <SelectItem value="Tenor">Tenor</SelectItem>
                        <SelectItem value="Bass">Bass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="address">Address</label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="school">School/Department</label>
                    <Input
                      id="school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Your school or department"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="bio">Bio</label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <AtSign className="mr-2 h-4 w-4" />
                      Email
                    </p>
                    <p>{email || "Not provided"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </p>
                    <p>{phone || "Not provided"}</p>
                  </div>
                  
                  {address && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Address
                      </p>
                      <p>{address}</p>
                    </div>
                  )}
                  
                  {school && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <School className="mr-2 h-4 w-4" />
                        School/Department
                      </p>
                      <p>{school}</p>
                    </div>
                  )}
                </div>
                
                {bio && (
                  <div className="space-y-1 pt-2">
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p>{bio}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          {isEditing && (
            <CardFooter>
              <Button 
                onClick={handleSaveProfile} 
                disabled={isLoading}
                className="ml-auto flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Additional profile sections can be added here */}
      </div>
    </div>
  );
}
