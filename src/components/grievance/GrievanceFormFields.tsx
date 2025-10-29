import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GrievanceFormFieldsProps {
  category: string;
  subCategory: string;
  setSubCategory: (value: string) => void;
  details: any;
  setDetails: (details: any) => void;
}

export const GrievanceFormFields = ({
  category,
  subCategory,
  setSubCategory,
  details,
  setDetails,
}: GrievanceFormFieldsProps) => {
  const updateDetail = (key: string, value: any) => {
    setDetails({ ...details, [key]: value });
  };

  const getSubCategories = () => {
    switch (category) {
      case "academic":
        return ["Teaching Quality", "Syllabus", "Time-Table Clash", "Lab/Equipment"];
      case "facility":
        return ["Classroom Infrastructure", "WiFi", "Water Supply", "Restrooms", "Canteen", "Hostel", "Library", "Parking"];
      case "examination":
        return ["Marks Related", "Exam Scheduling", "Exam Not Given", "Results Delay", "Invigilation/Conduct"];
      case "placement":
        return ["Eligibility Issues", "Company Opportunity", "Documentation", "Placement Cell Support", "Interview Process"];
      case "other":
        return ["General"];
      default:
        return [];
    }
  };

  const renderCategorySpecificFields = () => {
    if (!subCategory) return null;

    // Common fields that appear in multiple categories
    const commonFields = {
      subjectName: (
        <div className="space-y-2">
          <Label>Subject Name</Label>
          <Input value={details.subjectName || ""} onChange={(e) => updateDetail("subjectName", e.target.value)} required />
        </div>
      ),
      building: (
        <div className="space-y-2">
          <Label>Building</Label>
          <Input value={details.building || ""} onChange={(e) => updateDetail("building", e.target.value)} required />
        </div>
      ),
      floor: (
        <div className="space-y-2">
          <Label>Floor</Label>
          <Input value={details.floor || ""} onChange={(e) => updateDetail("floor", e.target.value)} required />
        </div>
      ),
      location: (
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={details.location || ""} onChange={(e) => updateDetail("location", e.target.value)} required />
        </div>
      ),
      issueType: (
        <div className="space-y-2">
          <Label>Issue Type</Label>
          <Input value={details.issueType || ""} onChange={(e) => updateDetail("issueType", e.target.value)} required />
        </div>
      ),
      companyName: (
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input value={details.companyName || ""} onChange={(e) => updateDetail("companyName", e.target.value)} required />
        </div>
      ),
    };

    // Academic category fields
    if (category === "academic") {
      switch (subCategory) {
        case "Teaching Quality":
          return (
            <>
              {commonFields.subjectName}
              <div className="space-y-2">
                <Label>Faculty Name</Label>
                <Input value={details.facultyName || ""} onChange={(e) => updateDetail("facultyName", e.target.value)} required />
              </div>
              {commonFields.issueType}
            </>
          );
        case "Syllabus":
          return (
            <>
              {commonFields.subjectName}
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input value={details.courseCode || ""} onChange={(e) => updateDetail("courseCode", e.target.value)} required />
              </div>
              {commonFields.issueType}
            </>
          );
        case "Time-Table Clash":
          return (
            <>
              <div className="space-y-2">
                <Label>Clash Type</Label>
                <Select value={details.clashType || ""} onValueChange={(value) => updateDetail("clashType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clash type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lecture">Lecture</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Internal Exam">Internal Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Clashing Subjects (comma-separated)</Label>
                <Input value={details.clashingSubjects || ""} onChange={(e) => updateDetail("clashingSubjects", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Date of Clash</Label>
                <Input type="date" value={details.dateOfClash || ""} onChange={(e) => updateDetail("dateOfClash", e.target.value)} required />
              </div>
            </>
          );
        case "Lab/Equipment":
          return (
            <>
              <div className="space-y-2">
                <Label>Lab Name or Number</Label>
                <Input value={details.labNameOrNumber || ""} onChange={(e) => updateDetail("labNameOrNumber", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Equipment or Software</Label>
                <Input value={details.equipmentOrSoftware || ""} onChange={(e) => updateDetail("equipmentOrSoftware", e.target.value)} required />
              </div>
              {commonFields.issueType}
            </>
          );
      }
    }

    // Facility category fields
    if (category === "facility") {
      switch (subCategory) {
        case "Classroom Infrastructure":
          return (
            <>
              {commonFields.building}
              <div className="space-y-2">
                <Label>Room Number</Label>
                <Input value={details.roomNo || ""} onChange={(e) => updateDetail("roomNo", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Item (e.g., Projector, Fan, etc.)</Label>
                <Input value={details.item || ""} onChange={(e) => updateDetail("item", e.target.value)} required />
              </div>
            </>
          );
        case "WiFi":
          return (
            <>
              {commonFields.building}
              {commonFields.floor}
              {commonFields.location}
            </>
          );
        case "Water Supply":
        case "Restrooms":
          return (
            <>
              {commonFields.building}
              {commonFields.floor}
              {commonFields.location}
              {commonFields.issueType}
            </>
          );
        case "Canteen":
          return (
            <>
              {commonFields.location}
              {commonFields.issueType}
            </>
          );
        case "Hostel":
          return (
            <>
              <div className="space-y-2">
                <Label>Hostel Name</Label>
                <Input value={details.hostelName || ""} onChange={(e) => updateDetail("hostelName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Room Number</Label>
                <Input value={details.roomNo || ""} onChange={(e) => updateDetail("roomNo", e.target.value)} required />
              </div>
              {commonFields.issueType}
            </>
          );
        case "Library":
          return (
            <>
              {commonFields.issueType}
              <div className="space-y-2">
                <Label>Book Name (if applicable)</Label>
                <Input value={details.bookName || ""} onChange={(e) => updateDetail("bookName", e.target.value)} />
              </div>
            </>
          );
        case "Parking":
          return (
            <>
              {commonFields.location}
              {commonFields.issueType}
            </>
          );
      }
    }

    // Examination category fields
    if (category === "examination") {
      switch (subCategory) {
        case "Marks Related":
          return (
            <>
              {commonFields.subjectName}
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input value={details.courseCode || ""} onChange={(e) => updateDetail("courseCode", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Exam Name</Label>
                <Input value={details.examName || ""} onChange={(e) => updateDetail("examName", e.target.value)} required />
              </div>
              {commonFields.issueType}
              <div className="space-y-2">
                <Label>Question Number (optional)</Label>
                <Input value={details.questionNumber || ""} onChange={(e) => updateDetail("questionNumber", e.target.value)} />
              </div>
            </>
          );
        case "Exam Scheduling":
          return (
            <>
              {commonFields.issueType}
              <div className="space-y-2">
                <Label>Clashing Subjects (comma-separated)</Label>
                <Input value={details.clashingSubjects || ""} onChange={(e) => updateDetail("clashingSubjects", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Exam Date</Label>
                <Input type="date" value={details.examDate || ""} onChange={(e) => updateDetail("examDate", e.target.value)} required />
              </div>
            </>
          );
        case "Exam Not Given":
          return (
            <>
              {commonFields.subjectName}
              <div className="space-y-2">
                <Label>Exam Date</Label>
                <Input type="date" value={details.examDate || ""} onChange={(e) => updateDetail("examDate", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Input value={details.reason || ""} onChange={(e) => updateDetail("reason", e.target.value)} required />
              </div>
            </>
          );
        case "Results Delay":
          return (
            <>
              <div className="space-y-2">
                <Label>Exam Name</Label>
                <Input value={details.examName || ""} onChange={(e) => updateDetail("examName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Input value={details.semester || ""} onChange={(e) => updateDetail("semester", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Expected Date</Label>
                <Input type="date" value={details.expectedDate || ""} onChange={(e) => updateDetail("expectedDate", e.target.value)} required />
              </div>
            </>
          );
        case "Invigilation/Conduct":
          return (
            <>
              <div className="space-y-2">
                <Label>Exam Name</Label>
                <Input value={details.examName || ""} onChange={(e) => updateDetail("examName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Room Number</Label>
                <Input value={details.roomNo || ""} onChange={(e) => updateDetail("roomNo", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Invigilator Name (optional)</Label>
                <Input value={details.invigilatorName || ""} onChange={(e) => updateDetail("invigilatorName", e.target.value)} />
              </div>
            </>
          );
      }
    }

    // Placement category fields
    if (category === "placement") {
      switch (subCategory) {
        case "Eligibility Issues":
          return (
            <>
              {commonFields.companyName}
              <div className="space-y-2">
                <Label>Criteria in Dispute</Label>
                <Input value={details.criteriaInDispute || ""} onChange={(e) => updateDetail("criteriaInDispute", e.target.value)} required />
              </div>
            </>
          );
        case "Company Opportunity":
          return (
            <>
              {commonFields.companyName}
              {commonFields.issueType}
            </>
          );
        case "Documentation":
          return (
            <>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Input value={details.documentType || ""} onChange={(e) => updateDetail("documentType", e.target.value)} required />
              </div>
              {commonFields.issueType}
            </>
          );
        case "Placement Cell Support":
          return <>{commonFields.issueType}</>;
        case "Interview Process":
          return (
            <>
              {commonFields.companyName}
              {commonFields.issueType}
            </>
          );
      }
    }

    // Other category - no specific fields needed
    return null;
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="sub-category">Sub-Category</Label>
        <Select value={subCategory} onValueChange={(value) => {
          setSubCategory(value);
          setDetails({});
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sub-category" />
          </SelectTrigger>
          <SelectContent>
            {getSubCategories().map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subCategory && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-sm text-muted-foreground">Category-Specific Details</h3>
          {renderCategorySpecificFields()}
        </div>
      )}
    </>
  );
};
