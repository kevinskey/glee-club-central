
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FanFormData {
  fullName: string;
  email: string;
  favoriteMemory: string;
}

export function useFanForm() {
  const [formData, setFormData] = useState<FanFormData>({
    fullName: "",
    email: "",
    favoriteMemory: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('fans')
        .insert({
          full_name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          favorite_memory: formData.favoriteMemory.trim() || null
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("This email is already registered as a fan!");
        } else {
          throw error;
        }
        return;
      }

      // Success
      setShowSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        favoriteMemory: ""
      });
      
      toast.success("Welcome to the GleeWorld fan family! 🎶");
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error: any) {
      console.error('Error submitting fan signup:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      favoriteMemory: ""
    });
    setShowSuccess(false);
  };

  return {
    formData,
    isSubmitting,
    showSuccess,
    handleInputChange,
    handleSubmit,
    resetForm
  };
}
