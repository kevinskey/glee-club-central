
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus, Tags } from 'lucide-react';
import { FanTagsTable } from '@/components/admin/FanTagsTable';
import { CreateTagModal } from '@/components/admin/CreateTagModal';
import { AssignTagsModal } from '@/components/admin/AssignTagsModal';
import { useFanTags } from '@/hooks/useFanTags';

export default function FanTagManagerPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const { tags, isLoading, refetch } = useFanTags();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fan Tag Management"
        description="Create and manage tags for organizing fans"
        icon={<Tags className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAssignModal(true)}
              variant="outline"
            >
              Assign Tags
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </div>
        }
      />

      <FanTagsTable 
        tags={tags} 
        isLoading={isLoading} 
        onRefresh={refetch}
      />

      <CreateTagModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={refetch}
      />

      <AssignTagsModal
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        tags={tags}
      />
    </div>
  );
}
