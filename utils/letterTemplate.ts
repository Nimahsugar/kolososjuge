/**
 * Letter Template Generator
 * Creates HTML templates for payment reminder letters
 */

import { Tenant } from '@/types/models';
import { format } from 'date-fns';

export type LetterTone = 'friendly' | 'formal' | 'urgent';

export interface LetterData {
  tenant: Tenant;
  customMessage?: string;
  tone: LetterTone;
  landlordName?: string;
  landlordContact?: string;
}

/**
 * Get default message based on tone
 */
export const getDefaultMessage = (tone: LetterTone, tenantName: string): string => {
  const messages = {
    friendly: `I hope this letter finds you well. This is a friendly reminder that your rent payment is due soon. We appreciate your continued tenancy and look forward to receiving your payment.`,
    formal: `This letter serves as a formal reminder regarding your upcoming rent payment. As per your lease agreement, payment is due on the specified date. We kindly request your prompt attention to this matter.`,
    urgent: `This is an urgent reminder regarding your overdue rent payment. Immediate payment is required to avoid any further action. Please contact us immediately to discuss payment arrangements if needed.`,
  };
  return messages[tone];
};

/**
 * Generate complete HTML letter template
 */
export const generateLetterHTML = (data: LetterData): string => {
  const { tenant, customMessage, tone, landlordName, landlordContact } = data;
  
  const today = format(new Date(), 'MMMM dd, yyyy');
  const dueDate = tenant.dueDate 
    ? format(new Date(tenant.dueDate), 'MMMM dd, yyyy')
    : 'Not specified';
  
  const message = customMessage || getDefaultMessage(tone, tenant.name);
  const propertyDisplay = tenant.unitNumber 
    ? `${tenant.propertyAddress}, Unit ${tenant.unitNumber}`
    : tenant.propertyAddress;
  
  const landlord = landlordName || 'Property Management';
  const contact = landlordContact || tenant.phoneNumber || '';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #0F172A;
        padding: 40px 60px;
        background: white;
      }
      
      .header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #4F46E5;
      }
      
      .title {
        font-size: 20pt;
        font-weight: bold;
        color: #4F46E5;
        margin-bottom: 5px;
      }
      
      .subtitle {
        font-size: 10pt;
        color: #64748B;
      }
      
      .date {
        margin-bottom: 30px;
        font-size: 11pt;
        color: #64748B;
      }
      
      .recipient {
        margin-bottom: 30px;
      }
      
      .recipient-name {
        font-weight: bold;
        font-size: 13pt;
        margin-bottom: 5px;
      }
      
      .recipient-address {
        color: #64748B;
        font-size: 11pt;
      }
      
      .subject {
        margin-bottom: 25px;
        padding: 15px;
        background: #F1F5F9;
        border-left: 4px solid #4F46E5;
      }
      
      .subject-label {
        font-weight: bold;
        font-size: 11pt;
        margin-bottom: 5px;
      }
      
      .subject-text {
        font-size: 12pt;
      }
      
      .salutation {
        margin-bottom: 20px;
        font-size: 12pt;
      }
      
      .body-text {
        margin-bottom: 20px;
        text-align: justify;
        line-height: 1.8;
      }
      
      .details-box {
        margin: 25px 0;
        padding: 20px;
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
      }
      
      .details-title {
        font-weight: bold;
        font-size: 13pt;
        margin-bottom: 15px;
        color: #1E293B;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #E2E8F0;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        font-weight: 600;
        color: #64748B;
        font-size: 11pt;
      }
      
      .detail-value {
        font-weight: bold;
        color: #0F172A;
        font-size: 11pt;
      }
      
      .amount {
        font-size: 16pt;
        color: #4F46E5;
        font-weight: bold;
      }
      
      .closing {
        margin-top: 30px;
        margin-bottom: 15px;
      }
      
      .signature {
        margin-top: 40px;
      }
      
      .signature-name {
        font-weight: bold;
        font-size: 12pt;
        margin-bottom: 3px;
      }
      
      .signature-title {
        color: #64748B;
        font-size: 10pt;
        margin-bottom: 10px;
      }
      
      .contact-info {
        color: #64748B;
        font-size: 10pt;
      }
      
      .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #E2E8F0;
        text-align: center;
        color: #94A3B8;
        font-size: 9pt;
      }
      
      @media print {
        body {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="title">Payment Reminder Notice</div>
      <div class="subtitle">Rent Flow HQ - Property Management</div>
    </div>
    
    <div class="date">${today}</div>
    
    <div class="recipient">
      <div class="recipient-name">${tenant.name}</div>
      <div class="recipient-address">${propertyDisplay}</div>
    </div>
    
    <div class="subject">
      <div class="subject-label">RE:</div>
      <div class="subject-text">Rent Payment Reminder</div>
    </div>
    
    <div class="salutation">Dear ${tenant.name},</div>
    
    <div class="body-text">
      ${message}
    </div>
    
    <div class="details-box">
      <div class="details-title">Payment Details</div>
      <div class="detail-row">
        <span class="detail-label">Property Address:</span>
        <span class="detail-value">${propertyDisplay}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Rent Amount:</span>
        <span class="detail-value amount">₦${tenant.rentAmount.toFixed(2)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span class="detail-value">${dueDate}</span>
      </div>
    </div>
    
    <div class="body-text">
      Please ensure payment is made by the due date to avoid any late fees. 
      If you have any questions or concerns regarding this payment, please do not hesitate to contact us.
    </div>
    
    <div class="closing">
      Thank you for your prompt attention to this matter.
    </div>
    
    <div class="closing">
      Sincerely,
    </div>
    
    <div class="signature">
      <div class="signature-name">${landlord}</div>
      <div class="signature-title">Property Manager</div>
      ${contact ? `<div class="contact-info">Contact: ${contact}</div>` : ''}
    </div>
    
    <div class="footer">
      This document was generated on ${today} using Rent Flow HQ
    </div>
  </body>
</html>
  `.trim();
};

/**
 * Get letter tone configuration
 */
export const getLetterToneConfig = (tone: LetterTone) => {
  const configs = {
    friendly: {
      label: 'Friendly Reminder',
      description: 'Warm and courteous tone',
      icon: 'happy-outline' as const,
      color: '#22C55E',
    },
    formal: {
      label: 'Formal Notice',
      description: 'Professional and official tone',
      icon: 'document-text-outline' as const,
      color: '#4F46E5',
    },
    urgent: {
      label: 'Urgent Notice',
      description: 'Firm and direct tone',
      icon: 'warning-outline' as const,
      color: '#F43F5E',
    },
  };
  return configs[tone];
};

