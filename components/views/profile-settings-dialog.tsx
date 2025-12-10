
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserData } from "@/components/app-wrapper"
import { Settings, Loader2, LogOut, Eye, EyeOff, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProfileSettingsDialogProps {
  userData: UserData
  onUpdate: (updatedData: Partial<UserData>) => Promise<void>
  onLogout: () => void
}

export function ProfileSettingsDialog({ userData, onUpdate, onLogout }: ProfileSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: userData.name,
    age: userData.age,
    gender: userData.gender,
    height: userData.height,
    weight: userData.weight,
    goal: userData.goal,
    level: userData.level,
    location: userData.location,
    dietaryPrefs: userData.dietaryPrefs,
    medicalHistory: userData.medicalHistory,
    stressLevel: userData.stressLevel,
  })

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeletePassword, setShowDeletePassword] = useState(false)

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setIsPasswordLoading(true)
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          newPassword: passwords.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      toast({
        title: "Success",
        description: "Password changed successfully.",
      })
      setPasswords({ newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onUpdate(formData)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) return

    setIsDeleting(true)
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          password: deletePassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      })
      onLogout()
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setDeletePassword("")
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Profile Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Read-only)</Label>
              <Input id="email" value={userData.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) => handleChange("age", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ""}
                onChange={(e) => handleChange("height", parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ""}
                onChange={(e) => handleChange("weight", parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select
                value={formData.goal || ""}
                onValueChange={(value) => handleChange("goal", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                  <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                  <SelectItem value="Improve Stamina">Improve Stamina</SelectItem>
                  <SelectItem value="Maintain">Maintain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Fitness Level</Label>
              <Select
                value={formData.level || ""}
                onValueChange={(value) => handleChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level</Label>
              <Select
                value={formData.stressLevel || ""}
                onValueChange={(value) => handleChange("stressLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dietaryPrefs">Dietary Preferences (comma separated)</Label>
            <Input
              id="dietaryPrefs"
              value={formData.dietaryPrefs?.join(", ") || ""}
              onChange={(e) => handleChange("dietaryPrefs", e.target.value.split(",").map(s => s.trim()))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              value={formData.medicalHistory || ""}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.newPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, newPassword: !showPasswords.newPassword })}
                    >
                      {showPasswords.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, confirmPassword: !showPasswords.confirmPassword })}
                    >
                      {showPasswords.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handlePasswordChange}
                disabled={isPasswordLoading || !passwords.newPassword}
              >
                {isPasswordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-4 mt-6 md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button type="button" variant="outline" onClick={onLogout} className="gap-2 w-full sm:w-auto">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <Button type="button" variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="gap-2 w-full sm:w-auto">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-end">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            Please enter your password to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="deletePassword">Password</Label>
          <div className="relative mt-2">
            <Input
              id="deletePassword"
              type={showDeletePassword ? "text" : "password"}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowDeletePassword(!showDeletePassword)}
            >
              {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setDeleteDialogOpen(false)
            setDeletePassword("")
          }}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting || !deletePassword}>
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
