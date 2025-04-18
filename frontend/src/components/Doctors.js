import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Users, ChevronDown, Home, UserCircle, Hospital, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/constants';
import { toast } from "react-hot-toast";

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      variant === 'primary'
        ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        : variant === 'outline'
        ? 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
        : 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    {children}
    {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
);

const CardContent = ({ children }) => (
  <div className="px-4 py-5 sm:p-6">{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="px-4 py-4 sm:px-6">{children}</div>
);

const Input = ({ ...props }) => (
  <input
    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-1 h-6"
    {...props}
  />
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Select = ({ children, ...props }) => (
  <select
    className="mt-1 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
);

export default function DoctorDashboard() {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    date: '',
    time: '',
    reason: '',
    prescriptionId: '',
    medication: '',
    dosage: '',
    frequency: '',
    tilldate: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [existingPrescriptions, setExistingPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorProfile();
    fetchPatientsWithAppointments();
    fetchAppointments();
    fetchCompletedAppointments();
    fetchUpcomingAppointments();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  useEffect(() => {
    if (appointmentData.patientId) {
      fetchExistingPrescriptions(appointmentData.patientId);
    }
  }, [appointmentData.patientId]);

  const fetchExistingPrescriptions = async (patientId) => {
    if (!patientId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + `/doctor/prescriptions/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const prescriptions = await response.json();
        setExistingPrescriptions(prescriptions);
      } else {
        console.error('Failed to fetch existing prescriptions');
        setExistingPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching existing prescriptions:', error);
      setExistingPrescriptions([]);
    }
  };

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/doctor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctorInfo(data);
        setEditedInfo(data);
      } else {
        console.error('Failed to fetch doctor profile');
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  const fetchPatientsWithAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/doctor/patients-with-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Patients with appointments:', data); // Add this line for debugging
        setPatients(data);
      } else {
        console.error('Failed to fetch patients with appointments');
      }
    } catch (error) {
      console.error('Error fetching patients with appointments:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/doctor/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const now = new Date();
        // Filter and sort appointments by date and time in ascending order
        const sortedAppointments = data
          .filter(appointment => new Date(appointment.date) > now || (new Date(appointment.date).toLocaleDateString() === now.toLocaleDateString() && appointment.time > now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })))
          .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
        setAppointments(sortedAppointments);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchCompletedAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(BASE_URL + '/doctor/appointment/completed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Optional: Sort by date and time (descending if you want most recent first)
        const sortedCompleted = data.sort((a, b) => 
          new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
        );
  
        setCompletedAppointments(sortedCompleted); // make sure you’ve defined this state
      } else {
        console.error('Failed to fetch completed appointments');
      }
    } catch (error) {
      console.error('Error fetching completed appointments:', error);
    }
  };
  
  const fetchUpcomingAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(BASE_URL + '/doctor/appointments/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Sort appointments by date and time (soonest first)
        const sortedUpcoming = data.sort((a, b) =>
          new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
        );
  
        setUpcomingAppointments(sortedUpcoming); // Make sure you have this state defined
      } else {
        console.error('Failed to fetch upcoming appointments');
      }
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + `/doctor/appointment/${appointmentId}/${status}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appointmentId })
      });
  
      if (response.ok) {
        // Optional: refresh appointments list
        fetchAppointments();
        fetchCompletedAppointments();
        return toast.success("Appointment status updated.");
      } else {
        return toast.error("Failed to update appointment status");
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };
  

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader icon={Calendar}>
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.length}
            </div>
            {appointments.length > 0 ? (
              <p className="text-xs text-gray-500">
                Next: {appointments[0].patientId.firstName} {appointments[0].patientId.lastName} at {appointments[0].time}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                No appointments today
              </p>
            )}
          </CardContent>
          <CardFooter className="p-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setShowAppointments(!showAppointments)}
            >
              {showAppointments ? "Hide" : "View"} Today's Appointments
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAppointments ? "rotate-180" : ""}`} />
            </Button>
          </CardFooter>
          {showAppointments && (
            <div className="px-4 pb-4">
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-t"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {appointment.patientId.firstName} {appointment.patientId.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{appointment.reason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-nowrap">{appointment.time}</p>

                      {/* Mark as Completed */}
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>

                      {/* Cancel Appointment */}
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                        className="text-red-600 hover:text-red-800"
                        title="Cancel Appointment"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No appointments scheduled for today
                </p>
              )}
            </div>
          )}

        </Card>
        <Card>
          <CardHeader icon={Users}>
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-gray-500">Total patients under care</p>
          </CardContent>
          <CardFooter className="p-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setShowPatients(!showPatients)}
            >
              {showPatients ? "Hide" : "View All"} Patients
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showPatients ? "rotate-180" : ""}`} />
            </Button>
          </CardFooter>
          {showPatients && (
            <div className="px-4 pb-4">
              {patients.map((patient, index) => (
                <div key={index} className="py-2 border-t">
                  <p className="text-sm font-medium">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('en-GB') : 'N/A'} | Next: {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {completedAppointments.slice(0, 3).map((appointment, index) => (
              <li key={appointment._id || index} className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>
                  {appointment.status === "completed" ? "Completed" : "Cancelled"} appointment with{" "}
                  <strong>
                    {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                  </strong>{" "}
                  on {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </span>
              </li>
            ))}

            {/* Static fallback if no completed appointments */}
            {completedAppointments.length === 0 && (
              <>
                <li className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">No records found.</span>
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {upcomingAppointments.slice(0, 3).map((appointment, index) => (
              <li key={appointment._id || index} className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>
                  Appointment with{" "}
                  <strong>
                    {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                  </strong>{" "}
                  on {new Date(appointment.date).toLocaleDateString()} at {appointment.time}. <span className="text-gray-500">{"(" + appointment.reason + ")"}</span>
                </span>
              </li>
            ))}

            {/* Fallback if there are no upcoming appointments */}
            {upcomingAppointments.length === 0 && (
              <>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">No upcoming schedule.</span>
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>

      </div>
    </>
  );

  const renderProfile = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + '/doctor/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editedInfo)
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setDoctorInfo(updatedProfile);
          setIsEditing(false);
          return toast.success("Profile updated successfully.");
        } else {
          const errorData = await response.json();
          return toast.success("Failed to update profile.");
        }
      } catch (error) {
        alert('Error updating doctor profile. Please try again.');
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={isEditing ? editedInfo.firstName : doctorInfo?.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={isEditing ? editedInfo.lastName : doctorInfo?.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={isEditing ? editedInfo.email : doctorInfo?.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                name="specialty"
                value={isEditing ? editedInfo.specialty : doctorInfo?.specialty}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={isEditing ? editedInfo.licenseNumber : doctorInfo?.licenseNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={isEditing ? editedInfo.phoneNumber : doctorInfo?.phoneNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="mr-2">Save</Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="ml-auto">Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderPatientManagement = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAppointmentData(prev => ({ ...prev, [name]: value }));

      if (name === 'action') {
        setSelectedAction(value);
      }

      if (name === 'patientId') {
        fetchExistingPrescriptions(value);
      }

      if (name === 'date' || name === 'patientId') {
        fetchAvailableSlots(appointmentData.patientId, value);
      }
    };

    const fetchAvailableSlots = async (patientId, date) => {
      if (!patientId || !date) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + `/doctor/available-slots?patientId=${patientId}&date=${date}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const slots = await response.json();
          setAvailableSlots(slots);
        } else {
          console.error('Failed to fetch available slots');
          setAvailableSlots([]);
          return toast.error("Failed to fetch available slots");
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setAvailableSlots([]);
      }
    };

    const handleEditPrescription = (prescription) => {
      setAppointmentData({
        ...appointmentData,
        prescriptionId: prescription._id,
        medication: prescription.medication || '',
        dosage: prescription.dosage || '',
        frequency: prescription.frequency || '',
        tilldate: prescription.tilldate || ''
      });
      setSelectedAction('prescribe-medication');
    };

    const handleDeletePrescription = async (prescriptionId) => {
      if (window.confirm('Are you sure you want to delete this prescription?')) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(BASE_URL + `/doctor/prescriptions/${prescriptionId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            fetchExistingPrescriptions(appointmentData.patientId);
            return toast.success('Prescription deleted successfully.');
          } else {
            const errorData = await response.json();
            console.error('Error details:', errorData.details);
            return toast.error(`Failed to delete prescription.`);
          }
        } catch (error) {
          alert('Error deleting prescription. Please try again.');
          console.error('Error deleting prescription:', error);
        }
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (selectedAction === 'prescribe-medication') {
        try {
          const token = localStorage.getItem('token');
          const url = appointmentData.prescriptionId
            ? BASE_URL + `/doctor/prescriptions/${appointmentData.prescriptionId}`
            : BASE_URL + '/doctor/prescribe-medication';
          const method = appointmentData.prescriptionId ? 'PUT' : 'POST';
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              doctorId: appointmentData.doctorId,
              patientId: appointmentData.patientId,
              medication: appointmentData.medication,
              dosage: appointmentData.dosage,
              frequency: appointmentData.frequency,
              tilldate: appointmentData.tilldate
            })
          });
          if (response.ok) {
            //const result = 
            await response.json();
            setAppointmentData({
              ...appointmentData,
              prescriptionId: '',
              medication: '',
              dosage: '',
              frequency: '',
              tilldate: ''
            });
            fetchExistingPrescriptions(appointmentData.patientId);
            setSelectedAction('');
            fetchExistingPrescriptions();
            return toast.success(appointmentData.prescriptionId ? 'Medication updated successfully' : 'Medication prescribed successfully');
          } else {
            const errorData = await response.json();
            return toast.error(`Failed to ${appointmentData.prescriptionId ? 'update' : 'prescribe'} medication: ${errorData.error}`);
          }
        } catch (error) {
          alert(`Error ${appointmentData.prescriptionId ? 'updating' : 'prescribing'} medication. Please try again.`);
        }
      } else if (selectedAction === 'schedule-appointment') {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(BASE_URL + '/doctor/schedule-appointment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              patientId: appointmentData.patientId,
              date: appointmentData.date,
              time: appointmentData.time,
              reason: appointmentData.reason
            })
          });
          if (response.ok) {
            setAppointmentData({
              patientId: '',
              date: '',
              time: '',
              reason: '',
              prescriptionId: '',
              medication: '',
              dosage: '',
              frequency: '',
              tilldate: ''
            });
            setSelectedAction('');
            fetchAppointments();
            fetchUpcomingAppointments();
            return toast.success('Appointment scheduled successfully.');
          } else {
            const errorData = await response.json();
            return toast.error(`Failed to schedule appointment: ${errorData.error}`);
          }
        } catch (error) {
          alert('Error scheduling appointment. Please try again.');
        }
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Select Patient</Label>
              <Select id="patient" name="patientId" value={appointmentData.patientId} onChange={handleInputChange}>
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select id="action" name="action" value={selectedAction} onChange={handleInputChange}>
                <option value="">Choose an action</option>
                <option value="schedule-appointment">Schedule Appointment</option>
                <option value="prescribe-medication">Prescribe Medication</option>
              </Select>
            </div>
            {selectedAction === 'schedule-appointment' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input id="date" name="date" type="date" value={appointmentData.date} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select id="time" name="time" value={appointmentData.time} onChange={handleInputChange} disabled={availableSlots.length === 0}>
                    <option value="">Choose a time slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input id="reason" name="reason" value={appointmentData.reason} onChange={handleInputChange} placeholder="Brief description of your concern" />
                </div>
              </>
            )}
            {selectedAction === 'prescribe-medication' && (
              <>
                {existingPrescriptions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <Label>Existing Prescriptions</Label>
                    {existingPrescriptions.map((prescription) => (
                      <div key={prescription._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{prescription.medication} - {prescription.dosage} - {prescription.frequency} - {" (Till - "}{new Date(prescription.tilldate).toLocaleDateString()}{") "}</span>
                        <div>
                          <Button type="button" onClick={() => handleEditPrescription(prescription)} variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button onClick={() => handleDeletePrescription(prescription._id)} variant="outline" size="sm">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication</Label>
                  <Input id="medication" name="medication" value={appointmentData.medication || ''} onChange={handleInputChange} placeholder="Medication name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input id="dosage" name="dosage" value={appointmentData.dosage || ''} onChange={handleInputChange} placeholder="Dosage" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input id="frequency" name="frequency" value={appointmentData.frequency || ''} onChange={handleInputChange} placeholder="Frequency" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tilldate">Till Date</Label>
                  <Input id="tilldate" name="tilldate" type="date" value={formatDate(appointmentData.tilldate) || ''} onChange={handleInputChange} />
                </div>
              </>
            )}
            <Button type="submit" className="ml-auto">
              {selectedAction === 'prescribe-medication' ? (appointmentData.prescriptionId ? 'Update Prescription' : 'Prescribe Medication') : 'Schedule Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-blue-600">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Medi-Track</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>Sign Out</Button>
      </header>
      <nav className="bg-blue-700 text-white p-4">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Button
              variant={activeTab === 'Dashboard' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Dashboard' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Profile' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Profile' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Profile')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Patient Management' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Patient Management' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Patient Management')}
            >
              <Users className="w-4 h-4 mr-2" />
              Patient Management
            </Button>
          </li>
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome, Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}</h1>
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Profile' && renderProfile()}
        {activeTab === 'Patient Management' && renderPatientManagement()}
      </main>
    </div>
  );
}