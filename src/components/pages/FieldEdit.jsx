import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FieldForm from '@/components/molecules/FieldForm';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import fieldService from '@/services/api/fieldService';

const FieldEdit = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fieldData = await fieldService.getById(parseInt(fieldId));
        
        if (fieldData) {
          setField(fieldData);
        } else {
          setError('Field not found');
        }
      } catch (err) {
        console.error('Error fetching field:', err);
        setError('Failed to load field data');
        toast.error('Failed to load field data');
      } finally {
        setLoading(false);
      }
    };

    if (fieldId) {
      fetchField();
    } else {
      setError('Invalid field ID');
      setLoading(false);
    }
  }, [fieldId]);

  const handleSubmitSuccess = (updatedField) => {
    toast.success('Field updated successfully!');
    // Navigate back to field details page
    navigate(`/fields/${fieldId}`);
  };

  const handleCancel = () => {
    // Navigate back to field details page
    navigate(`/fields/${fieldId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading message="Loading field data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorView 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorView 
          message="Field not found"
          onRetry={() => navigate('/fields')}
          retryText="Back to Fields"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FieldForm
          field={field}
          onSubmit={handleSubmitSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default FieldEdit;