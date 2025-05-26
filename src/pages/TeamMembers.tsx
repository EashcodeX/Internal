{/* Badge Management Modal */}
{showBadgeModal && selectedMember && (
  <BadgeManagement
    userId={selectedMember.id}
    userName={selectedMember.name}
    onClose={() => {
      setShowBadgeModal(false);
      setSelectedMember(null);
      loadAllMemberBadges(); // Refresh badges after modal closes
    }}
    onBadgeUpdate={() => {
      loadAllMemberBadges(); // Refresh badges when updates occur
    }}
  />
)}

const TeamMembers: React.FC = () => {
  // ... existing code ...
};

export default TeamMembers; 