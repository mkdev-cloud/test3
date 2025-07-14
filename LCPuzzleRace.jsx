import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, Play, AlertTriangle } from 'lucide-react';

// Directly embed gameData since importing local JSON files can cause resolution issues in some environments.
// This data was originally from workflow-game-data.json
const gameData = {
  "levelsToWin": 3,
  "levelStageConfig": {
    "Level1": 3,
    "Level2": 2,
    "Level3": 2 // Added Level3 configuration
  },
  "domains": [
    {
      "name": "Trade Finance",
      "stages": [
        {
          "id": "tf_stage_1",
          "name": "LC Basics & Issuance",
          "puzzles": [
            {
              "id": "tf_lc_1_1",
              "question": "Arrange the fundamental steps in the Letter of Credit (LC) issuance and initial document preparation process.",
              "correctSteps": [
                { "id": 101, "title": "Buyer Applies for LC", "description": "Buyer submits application for Letter of Credit to Issuing Bank.", "phase": "initiation" },
                { "id": 102, "title": "Issuing Bank Issues LC", "description": "Issuing Bank reviews application and issues the LC.", "phase": "initiation" },
                { "id": 103, "title": "Advising Bank Advises LC", "description": "Advising Bank receives and authenticates LC, then advises it to Seller.", "phase": "initiation" },
                { "id": 104, "title": "Seller Ships Goods", "description": "Seller ships goods as per contract and LC terms.", "phase": "execution" },
                { "id": 105, "title": "Seller Prepares Documents", "description": "Seller prepares all required shipping and commercial documents.", "phase": "execution" }
              ],
              "shuffledSteps": [
                { "id": 104, "title": "Seller Ships Goods", "description": "Seller ships goods as per contract and LC terms.", "phase": "execution" },
                { "id": 101, "title": "Buyer Applies for LC", "description": "Buyer submits application for Letter of Credit to Issuing Bank.", "phase": "initiation" },
                { "id": 105, "title": "Seller Prepares Documents", "description": "Seller prepares all required shipping and commercial documents.", "phase": "execution" },
                { "id": 103, "title": "Advising Bank Advises LC", "description": "Advising Bank receives and authenticates LC, then advises it to Seller.", "phase": "initiation" },
                { "id": 102, "title": "Issuing Bank Issues LC", "description": "Issuing Bank reviews application and issues the LC.", "phase": "initiation" }
              ]
            },
            {
              "id": "tf_lc_1_2",
              "question": "Sequence the events from trade contract signing to the seller's review of the LC.",
              "correctSteps": [
                { "id": 106, "title": "Trade Contract Signed", "description": "Buyer and Seller agree on trade terms and sign contract.", "phase": "initiation" },
                { "id": 107, "title": "Proforma Invoice Issued", "description": "Seller issues proforma invoice to Buyer.", "phase": "initiation" },
                { "id": 108, "title": "LC Application Submission", "description": "Buyer's bank receives LC application.", "phase": "initiation" },
                { "id": 109, "title": "LC Transmission to Advising Bank", "description": "Issuing bank transmits LC via SWIFT to advising bank.", "phase": "initiation" },
                { "id": 110, "title": "Seller Reviews LC", "description": "Seller reviews LC terms for acceptability and prepares for shipment.", "phase": "execution" }
              ],
              "shuffledSteps": [
                { "id": 108, "title": "LC Application Submission", "description": "Buyer's bank receives LC application.", "phase": "initiation" },
                { "id": 106, "title": "Trade Contract Signed", "description": "Buyer and Seller agree on trade terms and sign contract.", "phase": "initiation" },
                { "id": 110, "title": "Seller Reviews LC", "description": "Seller reviews LC terms for acceptability and prepares for shipment.", "phase": "execution" },
                { "id": 107, "title": "Proforma Invoice Issued", "description": "Seller issues proforma invoice to Buyer.", "phase": "initiation" },
                { "id": 109, "title": "LC Transmission to Advising Bank", "description": "Issuing bank transmits LC via SWIFT to advising bank.", "phase": "initiation" }
              ]
            },
            {
              "id": "tf_lc_1_3",
              "question": "Order the steps involved in preparing goods and obtaining essential documents for a trade finance shipment.",
              "correctSteps": [
                { "id": 111, "title": "Pre-shipment Inspection", "description": "Goods undergo inspection before shipment to ensure quality.", "phase": "execution" },
                { "id": 112, "title": "Bill of Lading Issued", "description": "Carrier issues Bill of Lading upon loading goods.", "phase": "execution" },
                { "id": 113, "title": "Commercial Invoice Prepared", "description": "Seller creates commercial invoice for the goods.", "phase": "execution" },
                { "id": 114, "title": "Certificate of Origin Obtained", "description": "Seller obtains Certificate of Origin from relevant authority.", "phase": "execution" },
                { "id": 115, "title": "Insurance Documents Arranged", "description": "Seller or Buyer arranges marine insurance as per Incoterms.", "phase": "execution" }
              ],
              "shuffledSteps": [
                { "id": 113, "title": "Commercial Invoice Prepared", "description": "Seller creates commercial invoice for the goods.", "phase": "execution" },
                { "id": 115, "title": "Insurance Documents Arranged", "description": "Seller or Buyer arranges marine insurance as per Incoterms.", "phase": "execution" },
                { "id": 111, "title": "Pre-shipment Inspection", "description": "Goods undergo inspection before shipment to ensure quality.", "phase": "execution" },
                { "id": 114, "title": "Certificate of Origin Obtained", "description": "Seller obtains Certificate of Origin from relevant authority.", "phase": "execution" },
                { "id": 112, "title": "Bill of Lading Issued", "description": "Carrier issues Bill of Lading upon loading goods.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "tf_stage_2",
          "name": "Document Presentation & Settlement",
          "puzzles": [
            {
              "id": "tf_lc_2_1",
              "question": "Sequence the process of document presentation and payment settlement under a Letter of Credit.",
              "correctSteps": [
                { "id": 116, "title": "Documents Presented by Seller", "description": "Seller presents compliant documents to Advising/Nominated Bank.", "phase": "execution" },
                { "id": 117, "title": "Bank Examines Documents", "description": "Advising/Nominated Bank examines documents for compliance.", "phase": "execution" },
                { "id": 118, "title": "Documents Forwarded to Issuing Bank", "description": "Compliant documents are sent to the Issuing Bank.", "phase": "settlement" },
                { "id": 119, "title": "Issuing Bank Verifies Documents", "description": "Issuing Bank verifies documents against LC terms.", "phase": "settlement" },
                { "id": 120, "title": "Issuing Bank Makes Payment", "description": "Upon verification, Issuing Bank pays the Seller's bank.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 118, "title": "Documents Forwarded to Issuing Bank", "description": "Compliant documents are sent to the Issuing Bank.", "phase": "settlement" },
                { "id": 116, "title": "Documents Presented by Seller", "description": "Seller presents compliant documents to Advising/Nominated Bank.", "phase": "execution" },
                { "id": 120, "title": "Issuing Bank Makes Payment", "description": "Upon verification, Issuing Bank pays the Seller's bank.", "phase": "settlement" },
                { "id": 117, "title": "Bank Examines Documents", "description": "Advising/Nominated Bank examines documents for compliance.", "phase": "execution" },
                { "id": 119, "title": "Issuing Bank Verifies Documents", "description": "Issuing Bank verifies documents against LC terms.", "phase": "settlement" }
              ]
            },
            {
              "id": "tf_lc_2_2",
              "question": "Order the steps involved in resolving discrepancies in LC documents and the subsequent finalization of the trade.",
              "correctSteps": [
                { "id": 121, "title": "Discrepancy Notified", "description": "If documents are non-compliant, discrepancies are notified.", "phase": "settlement" },
                { "id": 122, "title": "Seller Rectifies/Buyer Waives", "description": "Seller corrects documents or Buyer agrees to waive discrepancies.", "phase": "settlement" },
                { "id": 123, "title": "Buyer Pays Issuing Bank", "description": "Buyer pays Issuing Bank to release documents.", "phase": "settlement" },
                { "id": 124, "title": "Documents Released to Buyer", "description": "Issuing Bank releases documents to Buyer for goods clearance.", "phase": "settlement" },
                { "id": 125, "title": "Buyer Clears Goods", "description": "Buyer uses documents to clear goods from customs.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 124, "title": "Documents Released to Buyer", "description": "Issuing Bank releases documents to Buyer for goods clearance.", "phase": "settlement" },
                { "id": 121, "title": "Discrepancy Notified", "description": "If documents are non-compliant, discrepancies are notified.", "phase": "settlement" },
                { "id": 125, "title": "Buyer Clears Goods", "description": "Buyer uses documents to clear goods from customs.", "phase": "settlement" },
                { "id": 122, "title": "Seller Rectifies/Buyer Waives", "description": "Seller corrects documents or Buyer agrees to waive discrepancies.", "phase": "settlement" },
                { "id": 123, "title": "Buyer Pays Issuing Bank", "description": "Buyer pays Issuing Bank to release documents.", "phase": "settlement" }
              ]
            },
            {
              "id": "tf_lc_2_3",
              "question": "Arrange the final steps in the LC settlement process, including reimbursement and closure.",
              "correctSteps": [
                { "id": 126, "title": "Reimbursement Claim by Nominated Bank", "description": "Nominated Bank claims reimbursement from Issuing Bank.", "phase": "settlement" },
                { "id": 127, "title": "Reimbursement by Issuing Bank", "description": "Issuing Bank reimburses the Nominated Bank.", "phase": "settlement" },
                { "id": 128, "title": "Applicant (Buyer) Payment", "description": "Applicant pays the Issuing Bank for the transaction.", "phase": "settlement" },
                { "id": 129, "title": "Bank Charges Settlement", "description": "All outstanding bank charges and fees are settled.", "phase": "settlement" },
                { "id": 130, "title": "LC Final Closure", "description": "The Letter of Credit is officially closed.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 128, "title": "Applicant (Buyer) Payment", "description": "Applicant pays the Issuing Bank for the transaction.", "phase": "settlement" },
                { "id": 126, "title": "Reimbursement Claim by Nominated Bank", "description": "Nominated Bank claims reimbursement from Issuing Bank.", "phase": "settlement" },
                { "id": 129, "title": "Bank Charges Settlement", "description": "All outstanding bank charges and fees are settled.", "phase": "settlement" },
                { "id": 127, "title": "Reimbursement by Issuing Bank", "description": "Issuing Bank reimburses the Nominated Bank.", "phase": "settlement" },
                { "id": 130, "title": "LC Final Closure", "description": "The Letter of Credit is officially closed.", "phase": "settlement" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Distributed Finance",
      "stages": [
        {
          "id": "df_stage_1",
          "name": "DeFi Lending & Borrowing",
          "puzzles": [
            {
              "id": "df_defi_1_1",
              "question": "Sequence the typical steps a user would take to lend or borrow assets on a Decentralized Finance (DeFi) lending platform.",
              "correctSteps": [
                { "id": 201, "title": "User Connects Wallet", "description": "User connects their Web3 wallet to a DeFi lending platform.", "phase": "initiation" },
                { "id": 202, "title": "User Deposits Collateral", "description": "User deposits crypto assets (e.g., ETH, DAI) as collateral into a smart contract.", "phase": "execution" },
                { "id": 203, "title": "Platform Calculates Loan Terms", "description": "DeFi platform calculates available loan amount, interest rate, and liquidation price based on collateral.", "phase": "execution" },
                { "id": 204, "title": "User Borrows Funds", "description": "User borrows desired stablecoins or crypto assets against their collateral.", "phase": "execution" },
                { "id": 205, "title": "Funds Transferred via Smart Contract", "description": "Borrowed funds are instantly transferred to user's wallet via smart contract.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 203, "title": "Platform Calculates Loan Terms", "description": "DeFi platform calculates available loan amount, interest rate, and liquidation price based on collateral.", "phase": "execution" },
                { "id": 201, "title": "User Connects Wallet", "description": "User connects their Web3 wallet to a DeFi lending platform.", "phase": "initiation" },
                { "id": 205, "title": "Funds Transferred via Smart Contract", "description": "Borrowed funds are instantly transferred to user's wallet via smart contract.", "phase": "settlement" },
                { "id": 202, "title": "User Deposits Collateral", "description": "User deposits crypto assets (e.g., ETH, DAI) as collateral into a smart contract.", "phase": "execution" },
                { "id": 204, "title": "User Borrows Funds", "description": "User borrows desired stablecoins or crypto assets against their collateral.", "phase": "execution" }
              ]
            },
            {
              "id": "df_defi_1_2",
              "question": "Order the lifecycle of a liquidity provider in a DeFi lending pool.",
              "correctSteps": [
                { "id": 206, "title": "Liquidity Pool Deposit", "description": "Lender deposits assets into a liquidity pool on a DeFi protocol.", "phase": "initiation" },
                { "id": 207, "title": "Receiving LP Tokens", "description": "Lender receives Liquidity Provider (LP) tokens representing their share.", "phase": "initiation" },
                { "id": 208, "title": "Accruing Interest", "description": "Borrowed funds accrue interest, which is distributed to lenders.", "phase": "execution" },
                { "id": 209, "title": "Borrower Repays Loan", "description": "Borrower repays the principal and accrued interest.", "phase": "settlement" },
                { "id": 210, "title": "Lender Withdraws Funds", "description": "Lender redeems LP tokens to withdraw original deposit plus earned interest.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 208, "title": "Accruing Interest", "description": "Borrowed funds accrue interest, which is distributed to lenders.", "phase": "execution" },
                { "id": 206, "title": "Liquidity Pool Deposit", "description": "Lender deposits assets into a liquidity pool on a DeFi protocol.", "phase": "initiation" },
                { "id": 209, "title": "Borrower Repays Loan", "description": "Borrower repays the principal and accrued interest.", "phase": "settlement" },
                { "id": 210, "title": "Lender Withdraws Funds", "description": "Lender redeems LP tokens to withdraw original deposit plus earned interest.", "phase": "settlement" },
                { "id": 207, "title": "Receiving LP Tokens", "description": "Lender receives Liquidity Provider (LP) tokens representing their share.", "phase": "initiation" }
              ]
            }
          ]
        },
        {
          "id": "df_stage_2",
          "name": "Decentralized Exchanges (DEX)",
          "puzzles": [
            {
              "id": "df_dex_2_1",
              "question": "Arrange the steps for executing a cryptocurrency swap on a Decentralized Exchange (DEX).",
              "correctSteps": [
                { "id": 211, "title": "User Connects Wallet (DEX)", "description": "User connects their Web3 wallet to a Decentralized Exchange (DEX).", "phase": "initiation" },
                { "id": 212, "title": "Select Trading Pair", "description": "User selects the cryptocurrency pair they wish to trade (e.g., ETH/DAI).", "phase": "initiation" },
                { "id": 213, "title": "Approve Token Spending", "description": "User approves the DEX smart contract to spend their tokens (for ERC-20).", "phase": "execution" },
                { "id": 214, "title": "Submit Trade Order", "description": "User submits a swap or limit order on the DEX.", "phase": "execution" },
                { "id": 215, "title": "Smart Contract Executes Swap", "description": "The smart contract atomically executes the trade against a liquidity pool.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 214, "title": "Submit Trade Order", "description": "User submits a swap or limit order on the DEX.", "phase": "execution" },
                { "id": 211, "title": "User Connects Wallet (DEX)", "description": "User connects their Web3 wallet to a Decentralized Exchange (DEX).", "phase": "initiation" },
                { "id": 215, "title": "Smart Contract Executes Swap", "description": "The smart contract atomically executes the trade against a liquidity pool.", "phase": "settlement" },
                { "id": 212, "title": "Select Trading Pair", "description": "User selects the cryptocurrency pair they wish to trade (e.g., ETH/DAI).", "phase": "initiation" },
                { "id": 213, "title": "Approve Token Spending", "description": "User approves the DEX smart contract to spend their tokens (for ERC-20).", "phase": "execution" }
              ]
            },
            {
              "id": "df_dex_2_2",
              "question": "Sequence the process of providing and managing liquidity on a Decentralized Exchange (DEX).",
              "correctSteps": [
                { "id": 216, "title": "Liquidity Provision", "description": "User adds equal value of two tokens to a liquidity pool.", "phase": "initiation" },
                { "id": 217, "title": "Receiving LP Tokens", "description": "User receives liquidity provider (LP) tokens representing their pool share.", "phase": "initiation" },
                { "id": 218, "title": "Earning Trading Fees", "description": "LP tokens accrue a share of trading fees generated by the pool.", "phase": "execution" },
                { "id": 219, "title": "Impermanent Loss Monitoring", "description": "User monitors for impermanent loss due to price divergences.", "phase": "execution" },
                { "id": 220, "title": "Withdrawing Liquidity", "description": "User removes their liquidity, receiving their original deposit plus fees (minus impermanent loss).", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 218, "title": "Earning Trading Fees", "description": "LP tokens accrue a share of trading fees generated by the pool.", "phase": "execution" },
                { "id": 216, "title": "Liquidity Provision", "description": "User adds equal value of two tokens to a liquidity pool.", "phase": "initiation" },
                { "id": 220, "title": "Withdrawing Liquidity", "description": "User removes their liquidity, receiving their original deposit plus fees (minus impermanent loss).", "phase": "settlement" },
                { "id": 217, "title": "Receiving LP Tokens", "description": "User receives liquidity provider (LP) tokens representing their pool share.", "phase": "initiation" },
                { "id": 219, "title": "Impermanent Loss Monitoring", "description": "User monitors for impermanent loss due to price divergences.", "phase": "execution" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Supply Chain Finance",
      "stages": [
        {
          "id": "scf_stage_1",
          "name": "Invoice Discounting & Factoring",
          "puzzles": [
            {
              "id": "scf_invoice_1_1",
              "question": "Order the workflow for a standard Invoice Discounting transaction.",
              "correctSteps": [
                { "id": 301, "title": "Supplier Invoices Buyer", "description": "Supplier delivers goods/services and issues invoice to Buyer.", "phase": "initiation" },
                { "id": 302, "title": "Invoice Submitted to Financier", "description": "Supplier submits the invoice to a supply chain financier.", "phase": "initiation" },
                { "id": 303, "title": "Financier Verifies Invoice", "description": "Financier verifies the invoice with the Buyer.", "phase": "execution" },
                { "id": 304, "title": "Financier Advances Funds", "description": "Financier provides early payment (discounted) to Supplier.", "phase": "execution" },
                { "id": 305, "title": "Buyer Pays Financier", "description": "On due date, Buyer pays the full invoice amount to the Financier.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 303, "title": "Financier Verifies Invoice", "description": "Financier verifies the invoice with the Buyer.", "phase": "execution" },
                { "id": 301, "title": "Supplier Invoices Buyer", "description": "Supplier delivers goods/services and issues invoice to Buyer.", "phase": "initiation" },
                { "id": 305, "title": "Buyer Pays Financier", "description": "On due date, Buyer pays the full invoice amount to the Financier.", "phase": "settlement" },
                { "id": 302, "title": "Invoice Submitted to Financier", "description": "Supplier submits the invoice to a supply chain financier.", "phase": "initiation" },
                { "id": 304, "title": "Financier Advances Funds", "description": "Financier provides early payment (discounted) to Supplier.", "phase": "execution" }
              ]
            },
            {
              "id": "scf_invoice_1_2",
              "question": "Sequence the steps from Purchase Order issuance to the Supplier accepting early payment in an invoice financing scenario.",
              "correctSteps": [
                { "id": 306, "title": "Purchase Order Issued", "description": "Buyer issues Purchase Order (PO) to Supplier.", "phase": "initiation" },
                { "id": 307, "title": "Goods Delivered", "description": "Supplier delivers goods as per PO terms.", "phase": "execution" },
                { "id": 308, "title": "Invoice Approved by Buyer", "description": "Buyer approves the invoice, confirming goods receipt and validity.", "phase": "execution" },
                { "id": 309, "title": "Financier Offers Discount", "description": "Financier offers a discount rate for early payment to Supplier.", "phase": "execution" },
                { "id": 310, "title": "Supplier Accepts Early Payment", "description": "Supplier accepts the discounted early payment from Financier.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 308, "title": "Invoice Approved by Buyer", "description": "Buyer approves the invoice, confirming goods receipt and validity.", "phase": "execution" },
                { "id": 306, "title": "Purchase Order Issued", "description": "Buyer issues Purchase Order (PO) to Supplier.", "phase": "initiation" },
                { "id": 310, "title": "Supplier Accepts Early Payment", "description": "Supplier accepts the discounted early payment from Financier.", "phase": "settlement" },
                { "id": 307, "title": "Goods Delivered", "description": "Supplier delivers goods as per PO terms.", "phase": "execution" },
                { "id": 309, "title": "Financier Offers Discount", "description": "Financier offers a discount rate for early payment to Supplier.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "scf_stage_2",
          "name": "Reverse Factoring & Dynamic Discounting",
          "puzzles": [
            {
              "id": "scf_reverse_2_1",
              "question": "Arrange the steps in a Reverse Factoring (or Confirming) program workflow.",
              "correctSteps": [
                { "id": 311, "title": "Buyer Initiates Program", "description": "Buyer sets up a reverse factoring program with a bank/financier.", "phase": "initiation" },
                { "id": 312, "title": "Supplier Invoices Buyer", "description": "Supplier sends invoice to Buyer for goods/services.", "phase": "initiation" },
                { "id": 313, "title": "Invoice Approved by Buyer", "description": "Buyer approves the invoice and uploads it to the platform.", "phase": "execution" },
                { "id": 314, "title": "Bank Offers Early Payment", "description": "Bank offers early payment to Supplier based on Buyer's credit.", "phase": "execution" },
                { "id": 315, "title": "Buyer Pays Bank", "description": "On original due date, Buyer pays the full invoice amount to the bank.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 313, "title": "Invoice Approved by Buyer", "description": "Buyer approves the invoice and uploads it to the platform.", "phase": "execution" },
                { "id": 311, "title": "Buyer Initiates Program", "description": "Buyer sets up a reverse factoring program with a bank/financier.", "phase": "initiation" },
                { "id": 315, "title": "Buyer Pays Bank", "description": "On original due date, Buyer pays the full invoice amount to the bank.", "phase": "settlement" },
                { "id": 312, "title": "Supplier Invoices Buyer", "description": "Supplier sends invoice to Buyer for goods/services.", "phase": "initiation" },
                { "id": 314, "title": "Bank Offers Early Payment", "description": "Bank offers early payment to Supplier based on Buyer's credit.", "phase": "execution" }
              ]
            },
            {
              "id": "scf_dynamic_2_2",
              "question": "Sequence the key steps in a Dynamic Discounting process.",
              "correctSteps": [
                { "id": 316, "title": "Invoice Submitted (DD)", "description": "Supplier submits invoice to Buyer on a dynamic discounting platform.", "phase": "initiation" },
                { "id": 317, "title": "Buyer Approves Invoice (DD)", "description": "Buyer approves invoice, making it eligible for early payment.", "phase": "execution" },
                { "id": 318, "title": "Supplier Requests Early Payment", "description": "Supplier requests early payment, choosing a discount rate based on days early.", "phase": "execution" },
                { "id": 319, "title": "Buyer Makes Early Payment", "description": "Buyer pays the discounted invoice amount directly to the Supplier.", "phase": "settlement" },
                { "id": 320, "title": "Payment Recorded", "description": "Payment and discount details are recorded on the platform.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 318, "title": "Supplier Requests Early Payment", "description": "Supplier requests early payment, choosing a discount rate based on days early.", "phase": "execution" },
                { "id": 316, "title": "Invoice Submitted (DD)", "description": "Supplier submits invoice to Buyer on a dynamic discounting platform.", "phase": "initiation" },
                { "id": 320, "title": "Payment Recorded", "description": "Payment and discount details are recorded on the platform.", "phase": "settlement" },
                { "id": 317, "title": "Buyer Approves Invoice (DD)", "description": "Buyer approves invoice, making it eligible for early payment.", "phase": "execution" },
                { "id": 319, "title": "Buyer Makes Early Payment", "description": "Buyer pays the discounted invoice amount directly to the Supplier.", "phase": "settlement" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Loan Lifecycle",
      "stages": [
        {
          "id": "ll_stage_1",
          "name": "Origination & Underwriting",
          "puzzles": [
            {
              "id": "ll_orig_1_1",
              "question": "Arrange the core stages of loan origination from application to offer acceptance.",
              "correctSteps": [
                { "id": 401, "title": "Application Submission", "description": "Borrower submits loan application with required documents.", "phase": "initiation" },
                { "id": 402, "title": "Data Verification", "description": "Lender verifies applicant's identity, income, and credit history.", "phase": "execution" },
                { "id": 403, "title": "Credit Assessment", "description": "Lender assesses borrower's creditworthiness and repayment capacity.", "phase": "execution" },
                { "id": 404, "title": "Loan Offer Generated", "description": "Lender generates a loan offer with terms, interest rates, and fees.", "phase": "execution" },
                { "id": 405, "title": "Offer Acceptance", "description": "Borrower reviews and accepts the loan offer.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 403, "title": "Credit Assessment", "description": "Lender assesses borrower's creditworthiness and repayment capacity.", "phase": "execution" },
                { "id": 401, "title": "Application Submission", "description": "Borrower submits loan application with required documents.", "phase": "initiation" },
                { "id": 405, "title": "Offer Acceptance", "description": "Borrower reviews and accepts the loan offer.", "phase": "settlement" },
                { "id": 402, "title": "Data Verification", "description": "Lender verifies applicant's identity, income, and credit history.", "phase": "execution" },
                { "id": 404, "title": "Loan Offer Generated", "description": "Lender generates a loan offer with terms, interest rates, and fees.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "ll_orig_1_2",
          "name": "Servicing & Collection",
          "puzzles": [
            {
              "id": "ll_serv_2_1",
              "question": "Order the key activities involved in loan servicing, from disbursement to ongoing management.",
              "correctSteps": [
                { "id": 411, "title": "Loan Disbursed", "description": "Approved loan funds are disbursed to the borrower.", "phase": "execution" },
                { "id": 412, "title": "Repayment Schedule Setup", "description": "Loan servicing sets up the regular payment schedule.", "phase": "execution" },
                { "id": 413, "title": "Payment Processing", "description": "Borrower makes scheduled payments, which are processed by lender.", "phase": "settlement" },
                { "id": 414, "title": "Statement Generation", "description": "Regular statements are generated showing principal, interest, and balance.", "phase": "settlement" },
                { "id": 415, "title": "Interest Accrual Calculation", "description": "Daily or monthly interest accrual is calculated on outstanding principal.", "phase": "execution" }
              ],
              "shuffledSteps": [
                { "id": 413, "title": "Payment Processing", "description": "Borrower makes scheduled payments, which are processed by lender.", "phase": "settlement" },
                { "id": 411, "title": "Loan Disbursed", "description": "Approved loan funds are disbursed to the borrower.", "phase": "execution" },
                { "id": 415, "title": "Interest Accrual Calculation", "description": "Daily or monthly interest accrual is calculated on outstanding principal.", "phase": "execution" },
                { "id": 412, "title": "Repayment Schedule Setup", "description": "Loan servicing sets up the regular payment schedule.", "phase": "execution" },
                { "id": 414, "title": "Statement Generation", "description": "Regular statements are generated showing principal, interest, and balance.", "phase": "settlement" }
              ]
            },
            {
              "id": "ll_coll_2_2",
              "question": "Sequence the stages of the loan collection process when a payment is missed.",
              "correctSteps": [
                { "id": 416, "title": "Payment Missed", "description": "Borrower fails to make a scheduled payment.", "phase": "execution" },
                { "id": 417, "title": "Reminder Notification Sent", "description": "Automated reminders or calls are initiated for overdue payment.", "phase": "execution" },
                { "id": 418, "title": "Collection Attempt", "description": "Collection agents attempt to contact borrower to resolve arrears.", "phase": "execution" },
                { "id": 419, "title": "Restructuring/Workout Options", "description": "Lender may offer payment restructuring or workout plans.", "phase": "settlement" },
                { "id": 420, "title": "Loan Charged-off/Recovered", "description": "If unrecoverable, loan is charged-off; otherwise, recovery efforts continue.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 418, "title": "Collection Attempt", "description": "Collection agents attempt to contact borrower to resolve arrears.", "phase": "execution" },
                { "id": 416, "title": "Payment Missed", "description": "Borrower fails to make a scheduled payment.", "phase": "execution" },
                { "id": 420, "title": "Loan Charged-off/Recovered", "description": "If unrecoverable, loan is charged-off; otherwise, recovery efforts continue.", "phase": "settlement" },
                { "id": 417, "title": "Reminder Notification Sent", "description": "Automated reminders or calls are initiated for overdue payment.", "phase": "execution" },
                { "id": 419, "title": "Restructuring/Workout Options", "description": "Lender may offer payment restructuring or workout plans.", "phase": "settlement" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Payments",
      "stages": [
        {
          "id": "pay_stage_1",
          "name": "Domestic & Cross-Border Payments",
          "puzzles": [
            {
              "id": "pay_dom_1_1",
              "question": "Arrange the typical steps in a domestic electronic payment process.",
              "correctSteps": [
                { "id": 501, "title": "Payer Initiates Payment", "description": "Individual/entity initiates a payment (e.g., online transfer, bill pay).", "phase": "initiation" },
                { "id": 502, "title": "Originating Bank Processes", "description": "Payer's bank receives and processes the payment instruction.", "phase": "execution" },
                { "id": 503, "title": "Clearing House Settlement", "description": "Payment goes through a domestic clearing house (e.g., ACH, RTP).", "phase": "settlement" },
                { "id": 504, "title": "Beneficiary Bank Receives", "description": "Beneficiary's bank receives funds and credits account.", "phase": "settlement" },
                { "id": 505, "title": "Beneficiary Notified", "description": "Beneficiary is notified of incoming payment.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 503, "title": "Clearing House Settlement", "description": "Payment goes through a domestic clearing house (e.g., ACH, RTP).", "phase": "settlement" },
                { "id": 501, "title": "Payer Initiates Payment", "description": "Individual/entity initiates a payment (e.g., online transfer, bill pay).", "phase": "initiation" },
                { "id": 505, "title": "Beneficiary Notified", "description": "Beneficiary is notified of incoming payment.", "phase": "settlement" },
                { "id": 502, "title": "Originating Bank Processes", "description": "Payer's bank receives and processes the payment instruction.", "phase": "execution" },
                { "id": 504, "title": "Beneficiary Bank Receives", "description": "Beneficiary's bank receives funds and credits account.", "phase": "settlement" }
              ]
            },
            {
              "id": "pay_cb_1_2",
              "question": "Sequence the workflow for a cross-border payment using the SWIFT network.",
              "correctSteps": [
                { "id": 506, "title": "Sender Initiates Cross-Border Payment", "description": "Sender initiates a payment to an international recipient.", "phase": "initiation" },
                { "id": 507, "title": "Sender's Bank Sends SWIFT Message", "description": "Sender's bank sends a SWIFT MT103 (or equivalent) to correspondent bank.", "phase": "execution" },
                { "id": 508, "title": "Correspondent Bank Routes Payment", "description": "Correspondent bank(s) process and route payment through international networks.", "phase": "execution" },
                { "id": 509, "title": "Recipient's Bank Receives Funds", "description": "Recipient's bank receives funds and FX conversion occurs.", "phase": "settlement" },
                { "id": 510, "title": "Recipient Account Credited", "description": "Recipient's account is credited with the converted amount.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 508, "title": "Correspondent Bank Routes Payment", "description": "Correspondent bank(s) process and route payment through international networks.", "phase": "execution" },
                { "id": 506, "title": "Sender Initiates Cross-Border Payment", "description": "Sender initiates a payment to an international recipient.", "phase": "initiation" },
                { "id": 510, "title": "Recipient Account Credited", "description": "Recipient's account is credited with the converted amount.", "phase": "settlement" },
                { "id": 507, "title": "Sender's Bank Sends SWIFT Message", "description": "Sender's bank sends a SWIFT MT103 (or equivalent) to correspondent bank.", "phase": "execution" },
                { "id": 509, "title": "Recipient's Bank Receives Funds", "description": "Recipient's bank receives funds and FX conversion occurs.", "phase": "settlement" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Treasury Management",
      "stages": [
        {
          "id": "tm_stage_1",
          "name": "Cash Management & Liquidity",
          "puzzles": [
            {
              "id": "tm_cash_1_1",
              "question": "Arrange the key activities in a corporate cash management and liquidity workflow.",
              "correctSteps": [
                { "id": 601, "title": "Cash Position Aggregation", "description": "Treasury gathers real-time cash balances from all bank accounts.", "phase": "initiation" },
                { "id": 602, "title": "Cash Flow Forecasting", "description": "Predicting future cash inflows and outflows for short-term planning.", "phase": "execution" },
                { "id": 603, "title": "Liquidity Optimization", "description": "Moving surplus cash to investment vehicles or funding deficits.", "phase": "execution" },
                { "id": 604, "title": "Intercompany Lending/Borrowing", "description": "Managing cash movements between different entities within a group.", "phase": "execution" },
                { "id": 605, "title": "Daily Reconciliation", "description": "Reconciling bank statements with internal records at end of day.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 603, "title": "Liquidity Optimization", "description": "Moving surplus cash to investment vehicles or funding deficits.", "phase": "execution" },
                { "id": 601, "title": "Cash Position Aggregation", "description": "Treasury gathers real-time cash balances from all bank accounts.", "phase": "initiation" },
                { "id": 605, "title": "Daily Reconciliation", "description": "Reconciling bank statements with internal records at end of day.", "phase": "settlement" },
                { "id": 602, "title": "Cash Flow Forecasting", "description": "Predicting future cash inflows and outflows for short-term planning.", "phase": "execution" },
                { "id": 604, "title": "Intercompany Lending/Borrowing", "description": "Managing cash movements between different entities within a group.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "tm_stage_2",
          "name": "Risk Management & Investments",
          "puzzles": [
            {
              "id": "tm_risk_2_1",
              "question": "Order the process of managing foreign exchange (FX) risk within treasury operations.",
              "correctSteps": [
                { "id": 606, "title": "Foreign Exchange Exposure Identification", "description": "Identifying currency risks from international transactions.", "phase": "initiation" },
                { "id": 607, "title": "Hedging Strategy Development", "description": "Developing strategies (e.g., forwards, options) to mitigate FX risk.", "phase": "execution" },
                { "id": 608, "title": "Executing Hedging Instruments", "description": "Executing FX derivatives with financial institutions.", "phase": "execution" },
                { "id": 609, "title": "Mark-to-Market Valuation", "description": "Daily valuation of hedging instruments to assess effectiveness.", "phase": "execution" },
                { "id": 610, "title": "Hedge Settlement", "description": "Settlement of hedging contracts at maturity.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 608, "title": "Executing Hedging Instruments", "description": "Executing FX derivatives with financial institutions.", "phase": "execution" },
                { "id": 606, "title": "Foreign Exchange Exposure Identification", "description": "Identifying currency risks from international transactions.", "phase": "initiation" },
                { "id": 610, "title": "Hedge Settlement", "description": "Settlement of hedging contracts at maturity.", "phase": "settlement" },
                { "id": 607, "title": "Hedging Strategy Development", "description": "Developing strategies (e.g., forwards, options) to mitigate FX risk.", "phase": "execution" },
                { "id": 609, "title": "Mark-to-Market Valuation", "description": "Daily valuation of hedging instruments to assess effectiveness.", "phase": "execution" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Wealth Management",
      "stages": [
        {
          "id": "wm_stage_1",
          "name": "Financial Planning & Advisory",
          "puzzles": [
            {
              "id": "wm_plan_1_1",
              "question": "Arrange the initial stages of the financial planning and advisory process with a client.",
              "correctSteps": [
                { "id": 701, "title": "Client Onboarding", "description": "Gathering client personal and financial information, risk tolerance.", "phase": "initiation" },
                { "id": 702, "title": "Financial Goal Setting", "description": "Defining short-term and long-term financial objectives with client.", "phase": "initiation" },
                { "id": 703, "title": "Data Analysis & Needs Assessment", "description": "Analyzing assets, liabilities, income, expenses to assess financial health.", "phase": "execution" },
                { "id": 704, "title": "Strategy Development", "description": "Developing customized investment, retirement, and estate planning strategies.", "phase": "execution" },
                { "id": 705, "title": "Plan Presentation & Agreement", "description": "Presenting the financial plan to client and obtaining agreement.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 703, "title": "Data Analysis & Needs Assessment", "description": "Analyzing assets, liabilities, income, expenses to assess financial health.", "phase": "execution" },
                { "id": 701, "title": "Client Onboarding", "description": "Gathering client personal and financial information, risk tolerance.", "phase": "initiation" },
                { "id": 705, "title": "Plan Presentation & Agreement", "description": "Presenting the financial plan to client and obtaining agreement.", "phase": "settlement" },
                { "id": 702, "title": "Financial Goal Setting", "description": "Defining short-term and long-term financial objectives with client.", "phase": "initiation" },
                { "id": 704, "title": "Strategy Development", "description": "Developing customized investment, retirement, and estate planning strategies.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "wm_stage_2",
          "name": "Portfolio Management",
          "puzzles": [
            {
              "id": "wm_port_2_1",
              "question": "Sequence the ongoing activities involved in managing an investment portfolio for a client.",
              "correctSteps": [
                { "id": 706, "title": "Asset Allocation", "description": "Determining the optimal mix of asset classes based on risk profile.", "phase": "execution" },
                { "id": 707, "title": "Security Selection", "description": "Choosing individual stocks, bonds, funds within each asset class.", "phase": "execution" },
                { "id": 708, "title": "Portfolio Construction", "description": "Building the client's investment portfolio with selected securities.", "phase": "execution" },
                { "id": 709, "title": "Performance Monitoring", "description": "Regularly tracking portfolio performance against benchmarks and goals.", "phase": "execution" },
                { "id": 710, "title": "Rebalancing & Adjustments", "description": "Periodically adjusting portfolio to maintain target asset allocation and goals.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 708, "title": "Portfolio Construction", "description": "Building the client's investment portfolio with selected securities.", "phase": "execution" },
                { "id": 706, "title": "Asset Allocation", "description": "Determining the optimal mix of asset classes based on risk profile.", "phase": "execution" },
                { "id": 710, "title": "Rebalancing & Adjustments", "description": "Periodically adjusting portfolio to maintain target asset allocation and goals.", "phase": "settlement" },
                { "id": 707, "title": "Security Selection", "description": "Choosing individual stocks, bonds, funds within each asset class.", "phase": "execution" },
                { "id": 709, "title": "Performance Monitoring", "description": "Regularly tracking portfolio performance against benchmarks and goals.", "phase": "execution" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Equipment Finance",
      "stages": [
        {
          "id": "ef_stage_1",
          "name": "Lease & Loan Origination",
          "puzzles": [
            {
              "id": "ef_orig_1_1",
              "question": "Arrange the steps in the origination process for equipment financing.",
              "correctSteps": [
                { "id": 801, "title": "Application Submission", "description": "Customer submits application for equipment lease/loan.", "phase": "initiation" },
                { "id": 802, "title": "Credit Underwriting", "description": "Lender assesses customer's creditworthiness.", "phase": "execution" },
                { "id": 803, "title": "Equipment Valuation", "description": "Appraisal or valuation of the equipment being financed.", "phase": "execution" },
                { "id": 804, "title": "Offer & Documentation", "description": "Lender issues financing offer and prepares legal documents.", "phase": "execution" },
                { "id": 805, "title": "Funding & Booking", "description": "Funds disbursed, and the lease/loan is booked.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 803, "title": "Equipment Valuation", "description": "Appraisal or valuation of the equipment being financed.", "phase": "execution" },
                { "id": 801, "title": "Application Submission", "description": "Customer submits application for equipment lease/loan.", "phase": "initiation" },
                { "id": 805, "title": "Funding & Booking", "description": "Funds disbursed, and the lease/loan is booked.", "phase": "settlement" },
                { "id": 802, "title": "Credit Underwriting", "description": "Lender assesses customer's creditworthiness.", "phase": "execution" },
                { "id": 804, "title": "Offer & Documentation", "description": "Lender issues financing offer and prepares legal documents.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "ef_stage_2",
          "name": "Asset Management & End of Term",
          "puzzles": [
            {
              "id": "ef_asset_2_1",
              "question": "Sequence the stages of managing equipment during its finance term and at the end of the contract.",
              "correctSteps": [
                { "id": 806, "title": "Asset Tracking & Monitoring", "description": "Tracking equipment location, usage, and maintenance during term.", "phase": "execution" },
                { "id": 807, "title": "Billing & Payment Collection", "description": "Generating invoices and collecting regular lease/loan payments.", "phase": "execution" },
                { "id": 808, "title": "End of Term Notification", "description": "Customer receives notice about contract maturity options.", "phase": "settlement" },
                { "id": 809, "title": "Return/Purchase/Renewal Decision", "description": "Customer chooses to return, purchase, or renew the equipment.", "phase": "settlement" },
                { "id": 810, "title": "Asset Remarketing/Disposal", "description": "Lender disposes of returned equipment through sale or lease.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 808, "title": "End of Term Notification", "description": "Customer receives notice about contract maturity options.", "phase": "settlement" },
                { "id": 806, "title": "Asset Tracking & Monitoring", "description": "Tracking equipment location, usage, and maintenance during term.", "phase": "execution" },
                { "id": 810, "title": "Asset Remarketing/Disposal", "description": "Lender disposes of returned equipment through sale or lease.", "phase": "settlement" },
                { "id": 807, "title": "Billing & Payment Collection", "description": "Generating invoices and collecting regular lease/loan payments.", "phase": "execution" },
                { "id": 809, "title": "Return/Purchase/Renewal Decision", "description": "Customer chooses to return, purchase, or renew the equipment.", "phase": "settlement" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Commercial Real Estate (CRE)",
      "stages": [
        {
          "id": "cre_stage_1",
          "name": "Loan Origination & Underwriting (CRE)",
          "puzzles": [
            {
              "id": "cre_orig_1_1",
              "question": "Arrange the initial steps in securing a Commercial Real Estate (CRE) loan.",
              "correctSteps": [
                { "id": 901, "title": "Loan Application & Initial Due Diligence", "description": "Borrower submits application with property details, financials.", "phase": "initiation" },
                { "id": 902, "title": "Property Appraisal & Valuation", "description": "Independent appraisal to determine property market value.", "phase": "execution" },
                { "id": 903, "title": "Environmental & Structural Reviews", "description": "Assessment of environmental risks and building condition.", "phase": "execution" },
                { "id": 904, "title": "Tenant & Lease Analysis", "description": "Reviewing existing leases and tenant financials for income stability.", "phase": "execution" },
                { "id": 905, "title": "Underwriting & Approval", "description": "Lender's comprehensive assessment and approval of the loan.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 903, "title": "Environmental & Structural Reviews", "description": "Assessment of environmental risks and building condition.", "phase": "execution" },
                { "id": 901, "title": "Loan Application & Initial Due Diligence", "description": "Borrower submits application with property details, financials.", "phase": "initiation" },
                { "id": 905, "title": "Underwriting & Approval", "description": "Lender's comprehensive assessment and approval of the loan.", "phase": "settlement" },
                { "id": 902, "title": "Property Appraisal & Valuation", "description": "Independent appraisal to determine property market value.", "phase": "execution" },
                { "id": 904, "title": "Tenant & Lease Analysis", "description": "Reviewing existing leases and tenant financials for income stability.", "phase": "execution" }
              ]
            }
          ]
        },
        {
          "id": "cre_stage_2",
          "name": "Loan Closing & Servicing (CRE)",
          "puzzles": [
            {
              "id": "cre_close_2_1",
              "question": "Sequence the steps involved in closing and servicing a Commercial Real Estate (CRE) loan.",
              "correctSteps": [
                { "id": 906, "title": "Legal Documentation & Agreement", "description": "Preparation and signing of all loan and collateral documents.", "phase": "initiation" },
                { "id": 907, "title": "Title Search & Insurance", "description": "Verifying property ownership and securing title insurance.", "phase": "execution" },
                { "id": 908, "title": "Funding & Recording", "description": "Loan funds disbursed and lien recorded against property.", "phase": "settlement" },
                { "id": 909, "title": "Loan Servicing & Administration", "description": "Managing payments, escrow, and borrower communications.", "phase": "execution" },
                { "id": 910, "title": "Portfolio Monitoring & Reporting", "description": "Ongoing monitoring of property performance and loan covenants.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 908, "title": "Funding & Recording", "description": "Loan funds disbursed and lien recorded against property.", "phase": "settlement" },
                { "id": 906, "title": "Legal Documentation & Agreement", "description": "Preparation and signing of all loan and collateral documents.", "phase": "initiation" },
                { "id": 910, "title": "Portfolio Monitoring & Reporting", "description": "Ongoing monitoring of property performance and loan covenants.", "phase": "settlement" },
                { "id": 907, "title": "Title Search & Insurance", "description": "Verifying property ownership and securing title insurance.", "phase": "execution" },
                { "id": 909, "title": "Loan Servicing & Administration", "description": "Managing payments, escrow, and borrower communications.", "phase": "execution" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Receivable Finance",
      "stages": [
        {
          "id": "rf_stage_1",
          "name": "Invoice Purchase & Collection",
          "puzzles": [
            {
              "id": "rf_1_1",
              "question": "Arrange the steps in a typical factoring or invoice purchasing process.",
              "correctSteps": [
                { "id": 611, "title": "Goods/Services Delivered & Invoiced", "description": "Seller provides goods/services and invoices the customer.", "phase": "initiation" },
                { "id": 612, "title": "Invoice Sale to Factor", "description": "Seller sells the invoice (receivable) to a factoring company (factor).", "phase": "initiation" },
                { "id": 613, "title": "Advance Payment by Factor", "description": "Factor pays the seller an agreed-upon percentage of the invoice value upfront.", "phase": "execution" },
                { "id": 614, "title": "Customer Payment to Factor", "description": "On the invoice's due date, the customer pays the full amount directly to the factor.", "phase": "settlement" },
                { "id": 615, "title": "Rebate of Reserve to Seller", "description": "Factor pays the remaining balance to the seller, less fees, once customer pays.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 613, "title": "Advance Payment by Factor", "description": "Factor pays the seller an agreed-upon percentage of the invoice value upfront.", "phase": "execution" },
                { "id": 611, "title": "Goods/Services Delivered & Invoiced", "description": "Seller provides goods/services and invoices the customer.", "phase": "initiation" },
                { "id": 615, "title": "Rebate of Reserve to Seller", "description": "Factor pays the remaining balance to the seller, less fees, once customer pays.", "phase": "settlement" },
                { "id": 612, "title": "Invoice Sale to Factor", "description": "Seller sells the invoice (receivable) to a factoring company (factor).", "phase": "initiation" },
                { "id": 614, "title": "Customer Payment to Factor", "description": "On the invoice's due date, the customer pays the full amount directly to the factor.", "phase": "settlement" }
              ]
            }
          ]
        },
        {
          "id": "rf_stage_2",
          "name": "Invoice Discounting & Supply Chain Finance Integration",
          "puzzles": [
            {
              "id": "rf_1_4",
              "question": "Sequence the steps when a buyer initiates a supply chain finance program that involves early payment on approved invoices.",
              "correctSteps": [
                { "id": 616, "title": "Invoice Entry", "description": "Invoice entered in system", "phase": "initiation" },
                { "id": 617, "title": "Discounting Request", "description": "Discount request raised", "phase": "execution" },
                { "id": 618, "title": "Discount Rate Approved", "description": "Rate approved", "phase": "execution" },
                { "id": 619, "title": "Fund Transfer", "description": "Funds transferred to vendor", "phase": "settlement" },
                { "id": 620, "title": "Settlement Complete", "description": "Buyer clears dues", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 618, "title": "Discount Rate Approved", "description": "Rate approved", "phase": "execution" },
                { "id": 616, "title": "Invoice Entry", "description": "Invoice entered in system", "phase": "initiation" },
                { "id": 620, "title": "Settlement Complete", "description": "Buyer clears dues", "phase": "settlement" },
                { "id": 617, "title": "Discounting Request", "description": "Discount request raised", "phase": "execution" },
                { "id": 619, "title": "Fund Transfer", "description": "Funds transferred to vendor", "phase": "settlement" }
              ]
            },
            {
              "id": "rf_1_5",
              "question": "Order the process flow of a supply chain finance solution where a finance provider offers early payment to suppliers against buyer-approved invoices.",
              "correctSteps": [
                { "id": 621, "title": "Invoice Shared", "description": "Invoice shared with finance provider", "phase": "initiation" },
                { "id": 622, "title": "Offer Received", "description": "Bank shares offer", "phase": "execution" },
                { "id": 623, "title": "Offer Accepted", "description": "Vendor accepts offer", "phase": "execution" },
                { "id": 624, "title": "Funds Released", "description": "Funds released to vendor", "phase": "settlement" },
                { "id": 625, "title": "Buyer Pays Finance Provider", "description": "Buyer makes payment to the finance provider on the original invoice due date.", "phase": "settlement" }
              ],
              "shuffledSteps": [
                { "id": 623, "title": "Offer Accepted", "description": "Vendor accepts offer", "phase": "execution" },
                { "id": 621, "title": "Invoice Shared", "description": "Invoice shared with finance provider", "phase": "initiation" },
                { "id": 625, "title": "Buyer Pays Finance Provider", "description": "Buyer makes payment to the finance provider on the original invoice due date.", "phase": "settlement" },
                { "id": 622, "title": "Offer Received", "description": "Bank shares offer", "phase": "execution" },
                { "id": 624, "title": "Funds Released", "description": "Funds released to vendor", "phase": "settlement" }
              ]
            }
          ]
        }
      ]
    }
  ]
};


const LendingPuzzleRace = () => {
  // Initialize with a default domain, e.g., the first one from gameData or a specific one.
  // This ensures selectedDomain is not null when initializeGame is first called.
  const [selectedDomain, setSelectedDomain] = useState(gameData.domains[0]?.name || null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for each puzzle
  const [score, setScore] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0); // Still used for stage name display and future expansion
  const [totalPuzzlesCompleted, setTotalPuzzlesCompleted] = useState(0); // New state for overall puzzle completion

  const [correctSteps, setCorrectSteps] = useState([]); // Loaded for current puzzle
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [arrangedSteps, setArrangedSteps] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');


  // New state for custom game messages (success/fail/winner)
  const [showGameMessage, setShowGameMessage] = useState(false);
  const [gameMessageTitle, setGameMessageTitle] = useState('');
  const [gameMessageText, setGameMessageText] = useState(''); // Corrected useState declaration
  const [gameMessageIcon, setGameMessageIcon] = useState(null); // Lucide icon component

  // To track completed puzzles in the *current* session for randomization (avoiding repeats)
  const [completedPuzzlesInSession, setCompletedPuzzlesInSession] = useState([]); // Renamed from completedPuzzlesInStage

  // New states for level progression
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedStagesInCurrentLevel, setCompletedStagesInCurrentLevel] = useState(new Set());


  // Function to get a random non-repeating puzzle from ANY stage relevant to the current level
  const getRandomPuzzle = useCallback(() => {
    const selectedDomainData = gameData.domains.find(d => d.name === selectedDomain);
    if (!selectedDomainData) return null; // Ensure a domain is selected before proceeding

    // Calculate the start and end indices of stages for the current level
    let startIndex = 0;
    for (let i = 1; i < currentLevel; i++) {
      const prevLevelKey = `Level${i}`;
      startIndex += gameData.levelStageConfig[prevLevelKey];
    }
    const requiredStagesForCurrentLevel = gameData.levelStageConfig[`Level${currentLevel}`];
    const endIndex = startIndex + requiredStagesForCurrentLevel;

    // Get only the stages relevant to the current level
    const currentLevelStages = selectedDomainData.stages.slice(startIndex, endIndex);

    // FlatMap puzzles only from these current level stages
    const allPuzzlesInCurrentLevelStages = currentLevelStages.flatMap(stage => stage.puzzles);

    // Filter out puzzles that have already been completed in this session
    const availablePuzzles = allPuzzlesInCurrentLevelStages.filter(
      (puzzle) => !completedPuzzlesInSession.includes(puzzle.id)
    );

    if (availablePuzzles.length === 0) {
      // No more unique puzzles available in the current level's designated stages.
      // The game logic in checkSolution will handle level advancement or game over.
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    return availablePuzzles[randomIndex];
  }, [completedPuzzlesInSession, selectedDomain, currentLevel]); // currentLevel added to dependencies


  // Initialize game or move to the next puzzle
  const initializeGame = useCallback(() => {
    setShowGameMessage(false); // Hide any previous messages

    const puzzleData = getRandomPuzzle();

    if (puzzleData) {
      setCorrectSteps(puzzleData.correctSteps);
      setShuffledSteps(puzzleData.shuffledSteps || []);
      console.log("Setting Question: ", puzzleData.question);
      setCurrentQuestion(puzzleData.question || '');
      setArrangedSteps([]);
      setTimeLeft(180); // Reset timer for each new puzzle
      setGameState('playing'); // Ensure game state is playing
    } else {
      // This 'else' means getRandomPuzzle returned null, which implies all available puzzles are exhausted for the current level.
      // The game logic in checkSolution will handle level advancement or game over.
      // If we reach here, it means all puzzles in the current level's stages are done,
      // but the level advancement condition in checkSolution might not have been met yet (e.g., not enough unique stages completed).
      // Or it means all levels are completed.
      setGameMessageTitle("No More Puzzles Available in this Level!");
      setGameMessageText("You've exhausted all unique puzzles in the current level's workflows. Keep mastering stages to advance!");
      setGameMessageIcon(<AlertTriangle className="text-yellow-500" />);
      setShowGameMessage(true);
      setTimeout(() => {
        setShowGameMessage(false);
        // If all puzzles in the current level are exhausted, but not enough stages are done to win,
        // we might want to go to a "stuck" state or back to menu. For now, go to menu.
        setGameState('menu');
      }, 3000);
    }
  }, [getRandomPuzzle]);

  // Start game from the beginning (menu button click)
  const startGame = () => {
    // If no domain is explicitly selected by the user, default to the first one available
    if (!selectedDomain && gameData.domains.length > 0) {
      setSelectedDomain(gameData.domains[0].name);
    }
    setCurrentStageIndex(0);
    setCompletedPuzzlesInSession([]);
    setScore(0);
    setTotalPuzzlesCompleted(0);
    setCurrentLevel(1); // Reset current level
    setCompletedStagesInCurrentLevel(new Set()); // Reset completed stages for the new level
    // Use a setTimeout with 0 delay to ensure selectedDomain state updates before initializeGame is called
    // or refactor initializeGame to take selectedDomain as an argument.
    // For simplicity, ensuring selectedDomain is not null initially is better.
    initializeGame();
  };

  // Reset Game function - Resets all game states to their initial values
  const resetGame = useCallback(() => {
    setGameState('menu');
    setSelectedDomain(gameData.domains[0]?.name || null); // Reset to default selected domain
    setScore(0);
    setTotalPuzzlesCompleted(0);
    setCompletedPuzzlesInSession([]);
    setTimeLeft(180); // Reset timer
    setShuffledSteps([]);
    setArrangedSteps([]);
    setDraggedItem(null); // Clear any dragged item
    setCurrentQuestion('');
    setShowGameMessage(false);
    setGameMessageTitle('');
    setGameMessageText('');
    setGameMessageIcon(null);
    setCurrentLevel(1); // Reset current level
    setCompletedStagesInCurrentLevel(new Set()); // Reset completed stages for the new level
  }, []);


  // Timer effect
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      // Time's up, game over
      setGameMessageTitle("Time's Up!");
      setGameMessageText("You ran out of time. Game Over!");
      setGameMessageIcon(<XCircle className="text-red-500" />); // Keep red for error
      setShowGameMessage(true);
      setTimeout(() => {
        setShowGameMessage(false);
        setGameState('menu');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Drag and drop handlers
  const handleDragStart = (e, item, source) => {
    setDraggedItem({ item, source });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, source } = draggedItem;

    let newShuffledSteps = [...shuffledSteps];
    let newArrangedSteps = [...arrangedSteps];

    if (targetArea === 'arranged' && source === 'shuffled') {
      newShuffledSteps = newShuffledSteps.filter(step => step.id !== item.id);
      newArrangedSteps = [...newArrangedSteps, item];
    } else if (targetArea === 'shuffled' && source === 'arranged') {
      newArrangedSteps = newArrangedSteps.filter(step => step.id !== item.id);
      newShuffledSteps = [...newShuffledSteps, item];
    }

    setShuffledSteps(newShuffledSteps);
    setArrangedSteps(newArrangedSteps);
    setDraggedItem(null);
  };

  const checkSolution = (solution) => {
    // Only check if all steps are arranged
    if (solution.length !== correctSteps.length) {
      return;
    }
    const isCorrect = solution.every((step, index) => step.id === correctSteps[index].id);

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      setScore(prev => prev + 1000 + timeBonus);

      // Mark the current puzzle as completed in the session
      const selectedDomainData = gameData.domains.find(d => d.name === selectedDomain);
      let currentPuzzle = null;
      let currentStageId = null;

      if (selectedDomainData) {
        // Find the puzzle and its stage
        for (const stage of selectedDomainData.stages) {
          const foundPuzzle = stage.puzzles.find(p => p.correctSteps[0].id === correctSteps[0].id);
          if (foundPuzzle) {
            currentPuzzle = foundPuzzle;
            currentStageId = stage.id;
            break;
          }
        }
      }

      if (currentPuzzle) {
        setCompletedPuzzlesInSession(prev => [...prev, currentPuzzle.id]);
      }

      // Update total puzzles completed
      const newTotalPuzzlesCompleted = totalPuzzlesCompleted + 1;
      setTotalPuzzlesCompleted(newTotalPuzzlesCompleted);

      // Level progression logic
      const currentLevelKey = `Level${currentLevel}`;
      const requiredStagesForCurrentLevel = gameData.levelStageConfig[currentLevelKey];

      // Add the completed stage to the set for the current level
      if (currentStageId) {
        setCompletedStagesInCurrentLevel(prev => new Set(prev).add(currentStageId));
      }

      // Check if the required number of unique stages for the current level have been completed
      const hasCompletedRequiredStages = completedStagesInCurrentLevel.size + 1 >= requiredStagesForCurrentLevel; // +1 because state updates are async


      if (currentLevel < gameData.levelsToWin && hasCompletedRequiredStages) {
        // Advance to the next level
        setGameMessageTitle("Level Complete!");
        setGameMessageText(`You've completed Level ${currentLevel}! Advancing to Level ${currentLevel + 1}.`);
        setGameMessageIcon(<Trophy className="text-blue-500" />);
        setShowGameMessage(true);

        setTimeout(() => {
          setShowGameMessage(false);
          setCurrentLevel(prev => prev + 1);
          setCompletedStagesInCurrentLevel(new Set()); // Reset stages for the new level
          initializeGame(); // Load next puzzle for the new level
        }, 2500);

      } else if (currentLevel === gameData.levelsToWin && hasCompletedRequiredStages) {
        // Game Win condition
        setGameMessageTitle("Congratulations, Winner!");
        setGameMessageText(`You've mastered all levels in ${selectedDomain} with a final score of ${score + 1000 + timeBonus}!`);
        setGameMessageIcon(<Trophy className="text-yellow-500" />);
        setShowGameMessage(true);
        setTimeout(() => {
          setShowGameMessage(false);
          setGameState('completed');
        }, 3000);
      } else {
        // Show success message and proceed to next puzzle within the same level
        setGameMessageTitle("Correct Order!");
        setGameMessageText("Excellent! Proceeding to the next challenge.");
        setGameMessageIcon(<CheckCircle className="text-green-600" />);
        setShowGameMessage(true);

        setTimeout(() => {
          setShowGameMessage(false);
          initializeGame(); // Load next puzzle
        }, 2000);
      }

    } else {
      // Handle incorrect solution - Game Over
      setScore(prev => Math.max(0, prev - 50));
      setGameMessageTitle("Incorrect Order!");
      setGameMessageText("Oops! The workflow is incorrect. Game Over.");
      setGameMessageIcon(<XCircle className="text-red-600" />);
      setShowGameMessage(true);

      setTimeout(() => {
        setShowGameMessage(false);
        setGameState('menu');
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColorClass = (phase) => {
    switch (phase) {
      case 'initiation': return 'phase-corporate-blue';
      case 'execution': return 'phase-corporate-green';
      case 'settlement': return 'phase-corporate-orange';
      default: return 'phase-corporate-default';
    }
  };

  return (
    <div className="lc-puzzle-container">
      <style>
        {`
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        .lc-puzzle-container {
            min-height: 100vh;
            background-color: #F8F9FA; /* Light gray/off-white background */
            padding: 20px;
            box-sizing: border-box;
            color: #333333; /* Dark gray for general text */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            /* Increased max-width for the overall container */
            max-width: 1400px; /* Adjust as needed for desired page width */
            margin: 0 auto; /* Center the container */
        }

        /* Menu State */
        .menu-container {
            min-height: 100vh;
            width: 100%;
            background-color: #F8F9FA; /* Consistent with main background */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .menu-card {
            background: #FFFFFF; /* Solid white background */
            border-radius: 8px; /* Slightly less rounded */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Softer shadow */
            padding: 2rem;
            max-width: 48rem; /* Increased max-width for menu card */
            width: 100%;
            text-align: center;
            border: 2px solid #DDDDDD; /* More prominent border */
        }

        .menu-icon {
            margin: 0 auto 1rem;
            height: 4rem;
            width: 4rem;
            color: #004481; /* Corporate blue icon color */
        }

        .menu-title {
            font-size: 2.2rem; /* Larger title */
            font-weight: 700;
            color: #333333;
            margin-bottom: 0.75rem;
        }

        .menu-subtitle {
            color: #666666; /* Medium gray for subtitle */
            margin-bottom: 2rem; /* Increased margin */
            font-size: 1.1rem; /* Slightly larger subtitle */
        }

        .how-to-play-box {
            background-color: #F0F4F8; /* Lighter background for the box */
            border-radius: 6px; /* Slightly less rounded */
            padding: 1.5rem; /* Increased padding */
            margin-bottom: 2rem; /* Increased margin */
            text-align: left;
            color: #333333;
            border: 1px solid #CCCCCC; /* More visible border */
        }

        .how-to-play-title {
            font-weight: 600;
            color: #333333;
            margin-bottom: 0.75rem; /* Adjusted margin */
            font-size: 1.1rem; /* Slightly larger title */
        }

        .how-to-play-list li {
            margin-bottom: 0.6rem; /* Adjusted margin */
            line-height: 1.6; /* Slightly more line height */
            color: #666666;
            font-size: 0.95rem;
        }

        .domain-selection-container {
            margin-bottom: 2rem; /* Increased margin */
            text-align: center;
            border: 1px solid #CCCCCC; /* Border for the domain section */
            padding: 1.5rem;
            border-radius: 6px;
            background-color: #FDFDFD;
        }

        .domain-selection-container label {
            display: block;
            margin-bottom: 1rem; /* Increased margin */
            color: #333333;
            font-weight: 600;
            font-size: 1.1rem;
        }

        .domain-buttons-wrapper {
            display: flex;
            gap: 0.75rem; /* Increased gap */
            flex-wrap: wrap;
            justify-content: center; /* Center items in case of odd number */
        }

        .domain-button {
            padding: 10px 20px; /* Increased padding */
            border: 1px solid #004481; /* Blue border */
            background: #FFFFFF;
            color: #004481;
            border-radius: 6px; /* More rounded */
            cursor: pointer;
            transition: all 0.2s ease; /* Faster transition */
            font-weight: 600;
            flex: 1 1 calc(50% - 0.75rem); /* Two buttons per row with a gap */
            max-width: calc(50% - 0.75rem); /* Ensures it doesn't grow beyond 50% */
            min-width: 150px; /* Minimum width to prevent shrinking too much on small screens */
            font-size: 1rem; /* Slightly larger font */
            box-shadow: 0 2px 5px rgba(0, 68, 129, 0.1); /* Subtle shadow */
        }

        @media (max-width: 600px) {
            .domain-button {
                flex: 1 1 100%; /* Full width on very small screens */
                max-width: 100%;
            }
        }

        .domain-button.selected, .domain-button:hover {
            background: #004481; /* Solid blue background */
            color: #FFFFFF;
            transform: translateY(-3px); /* More pronounced lift */
            box-shadow: 0 5px 12px rgba(0, 68, 129, 0.4); /* More prominent blue shadow */
        }

        .start-game-button, .play-again-button {
            background: #004481; /* Solid corporate blue */
            color: #FFFFFF;
            border: none;
            padding: 15px 35px; /* Adjusted padding */
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 5px 15px rgba(0, 68, 129, 0.3);
            font-weight: 600;
            letter-spacing: 0.5px;
            width: 100%;
            margin-top: 20px; /* Space between domain selection and button */
        }

        .start-game-button:hover, .play-again-button:hover {
            background: #0056A0; /* Slightly darker blue on hover */
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(0, 68, 129, 0.4);
        }

        /* Game Play State */
        .game-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px; /* Increased margin */
            padding: 15px 30px; /* Added padding */
            background-color: #FFFFFF; /* White background for header */
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* Subtle shadow */
            max-width: 1200px; /* Align with content area */
            box-sizing: border-box;
            position: relative; /* Needed for absolute positioning of domain name */
        }

        .header-section {
            display: flex;
            align-items: center;
            font-size: 1.1rem; /* Slightly larger font */
            color: #555555; /* Medium gray color */
            font-weight: 500;
        }

        .header-section svg {
            margin-right: 8px;
            color: #004481; /* Corporate blue icon */
        }

        .score-display span, .timer-display span {
            font-weight: 700;
            color: #004481; /* Corporate blue for values */
            margin-left: 5px;
        }

        .level-display span {
            font-weight: 700;
            color: #004481;
            margin-left: 5px;
        }

        .header-domain-name {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.3rem;
            font-weight: 700;
            color: #004481; /* Corporate blue for domain name */
            white-space: nowrap; /* Prevent wrapping */
            overflow: hidden; /* Hide overflow if text is too long */
            text-overflow: ellipsis; /* Add ellipsis if text is too long */
            max-width: 40%; /* Limit width to prevent overlap */
            text-align: center;
        }

        .right-header-group {
            display: flex;
            align-items: center;
            gap: 20px; /* Space between level, timer, and reset button */
        }

        .reset-game-button {
            background-color: #dc3545; /* Red color for reset button */
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.95rem;
            font-weight: 600;
            transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .reset-game-button:hover {
            background-color: #c82333;
            transform: translateY(-1px);
        }

        .puzzle-section {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 1200px; /* Max width for puzzle content */
            background-color: #FFFFFF; /* White background */
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 30px; /* Increased padding */
            box-sizing: border-box;
            margin-bottom: 25px;
        }

        .question-box {
            background-color: #E6EEF5; /* Light blue for question */
            border-left: 5px solid #004481; /* Corporate blue border */
            padding: 18px 25px; /* Increased padding */
            margin-bottom: 30px; /* More space */
            border-radius: 5px;
            font-size: 1.25rem; /* Larger font for question */
            font-weight: 600;
            color: #004481; /* Corporate blue text */
        }

        .drag-drop-areas {
            display: flex;
            flex-direction: row; /* Ensures side-by-side layout */
            justify-content: space-between;
            gap: 25px; /* Increased gap */
            width: 100%;
            flex-wrap: wrap; /* Allow wrapping on smaller screens */
            align-items: flex-start; /* Align items to the top */
        }

        .shuffled-steps-area, .arranged-steps-area {
            background-color: #F8F8F8; /* Light grey for areas */
            border: 2px dashed #CCCCCC; /* Clearer dashed border */
            border-radius: 8px;
            padding: 20px;
            flex: 1; /* Allows them to grow and shrink */
            min-height: 250px; /* Increased min-height */
            display: flex;
            flex-direction: column;
            gap: 12px; /* Gap between puzzle items */
            transition: all 0.2s ease;
            box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.05); /* Inner shadow */
            min-width: 300px; /* Ensure a minimum width before wrapping */
        }

        @media (max-width: 768px) {
            .drag-drop-areas {
                flex-direction: column;
                gap: 20px;
            }
            .shuffled-steps-area, .arranged-steps-area {
                min-width: unset; /* Remove min-width when stacking */
                width: 100%; /* Take full width when stacked */
                max-width: 100%; /* Ensure it doesn't exceed 100% */
            }
        }

        .drag-drop-area.highlight {
            border-color: #004481; /* Highlight with corporate blue */
            background-color: #EBF2F8; /* Lighter blue background */
        }

        .area-title {
            font-weight: 700;
            color: #004481;
            margin-bottom: 15px; /* Space below title */
            text-align: center;
            font-size: 1.1rem;
        }

        .puzzle-item {
            background-color: #FFFFFF;
            border: 1px solid #DDDDDD; /* Lighter border */
            border-radius: 6px;
            padding: 12px 18px; /* Adjusted padding */
            cursor: grab;
            font-size: 0.95rem; /* Slightly smaller text for items */
            font-weight: 500;
            color: #444444;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07); /* Subtle shadow */
            transition: transform 0.1s ease-in-out;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .puzzle-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .puzzle-item.dragging {
            opacity: 0.5;
            border: 2px dashed #004481;
        }

        .puzzle-item-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: #333333;
        }

        .puzzle-item-description {
            font-size: 0.85rem;
            color: #777777;
        }

        .phase-tag {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 8px;
            align-self: flex-end; /* Aligns to bottom-right of the item */
            text-transform: uppercase;
        }

        .phase-corporate-blue {
            background-color: #E6EEF5; /* Light blue */
            color: #004481; /* Corporate blue */
        }
        .phase-corporate-green {
            background-color: #E0F2E6; /* Light green */
            color: #28A745; /* Corporate green */
        }
        .phase-corporate-orange {
            background-color: #FFF3E0; /* Light orange */
            color: #FD7E14; /* Corporate orange */
        }
        .phase-corporate-default {
            background-color: #F0F0F0;
            color: #555555;
        }


        .submit-button-container {
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: center;
            margin-top: 25px; /* Space between areas and button */
        }

        .submit-button {
            background: #28A745; /* Green for submit */
            color: #FFFFFF;
            border: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .submit-button:hover {
            background: #218838; /* Darker green on hover */
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(40, 167, 69, 0.4);
        }

        /* Game Message Overlay */
        .game-message-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px); /* Frosted glass effect */
        }

        .game-message-card {
            background: #FFFFFF;
            border-radius: 12px; /* More rounded */
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); /* More pronounced shadow */
            padding: 2.5rem; /* More padding */
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: translateY(0); /* Ensure no initial transform */
            opacity: 1;
            animation: fadeInScale 0.3s ease-out; /* Add animation */
            border: 2px solid #DDDDDD; /* Light border */
        }

        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .game-message-icon {
            margin: 0 auto 1.5rem; /* Adjusted margin */
            height: 5rem; /* Larger icon */
            width: 5rem;
        }

        .game-message-title {
            font-size: 2rem; /* Larger title */
            font-weight: 700;
            color: #333333;
            margin-bottom: 1rem;
        }

        .game-message-text {
            color: #666666;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            line-height: 1.5;
        }

        /* Completed State */
        .completed-container {
            min-height: 100vh;
            width: 100%;
            background-color: #F8F9FA;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .completed-card {
            background: #FFFFFF;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            max-width: 50rem; /* Increased max width */
            width: 100%;
            text-align: center;
            border: 2px solid #DDDDDD;
        }

        .completed-icon {
            margin: 0 auto 1rem;
            height: 4rem;
            width: 4rem;
            color: #FFD700; /* Gold trophy color */
        }

        .completed-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #333333;
            margin-bottom: 0.75rem;
        }

        .completed-score {
            color: #666666;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            font-weight: 500;
        }

        .workflow-mastered-box {
          background-color: #F0F4F8;
          border-radius: 6px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
          color: #333333;
          border: 1px solid #CCCCCC;
        }

        .workflow-mastered-box h3 {
          font-weight: 600;
          color: #004481;
          margin-bottom: 1rem;
          font-size: 1.15rem;
          text-align: center;
        }

        .workflow-mastered-box ul {
          list-style: none; /* Remove default bullet points */
          padding-left: 0;
        }

        .workflow-mastered-box ul li {
          margin-bottom: 0.8rem;
          color: #555555;
          font-size: 1rem;
          line-height: 1.4;
          position: relative;
          padding-left: 1.5rem; /* Space for custom bullet */
        }

        .workflow-mastered-box ul li::before {
          content: '✔'; /* Checkmark for mastered workflows */
          color: #28A745; /* Green checkmark */
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .workflow-mastered-box ul ul {
          margin-top: 0.4rem;
          border-left: 3px solid #E6EEF5; /* Light blue line */
          padding-left: 1rem;
          list-style: none;
        }

        .workflow-mastered-box ul ul li {
          font-size: 0.9rem;
          color: #777777;
          margin-bottom: 0.3rem;
          padding-left: 1rem;
          position: relative;
        }

        .workflow-mastered-box ul ul li::before {
          content: '•'; /* Small dot for puzzle questions */
          color: #004481; /* Corporate blue dot */
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 1;
        }

        `}
      </style>

      {/* Game Menu */}
      {gameState === 'menu' && (
        <div className="menu-container">
          <div className="menu-card">
            <Play className="menu-icon" />
            <h1 className="menu-title">Lending Puzzle Race</h1>
            <p className="menu-subtitle">Arrange the workflow steps in the correct order!</p>

            <div className="how-to-play-box">
              <h3 className="how-to-play-title">How to Play:</h3>
              <ul className="how-to-play-list">
                <li>Select a **domain** to start the challenge.</li>
                <li>You'll be presented with **shuffled steps** of a workflow.</li>
                <li>Drag and drop the steps into the **arranged area** in the correct sequence.</li>
                <li>Once all steps are arranged, click **'Check Solution'** to verify.</li>
                <li>Complete the required number of stages to **level up** and eventually win the game!</li>
                <li>Each correct puzzle earns you points and a time bonus.</li>
                <li>An incorrect order or running out of time results in **Game Over**.</li>
              </ul>
            </div>

            <div className="domain-selection-container">
              <label htmlFor="domain-select">Choose your domain:</label>
              <div className="domain-buttons-wrapper">
                {gameData.domains.map(domain => (
                  <button
                    key={domain.name}
                    className={`domain-button ${selectedDomain === domain.name ? 'selected' : ''}`}
                    onClick={() => setSelectedDomain(domain.name)}
                  >
                    {domain.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startGame} className="start-game-button">
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Playing State */}
      {gameState === 'playing' && (
        <>
          <div className="game-header">
            <div className="header-section score-display">
              Score: <span>{score}</span>
            </div>
            {/* Domain Name added here */}
            <div className="header-domain-name">
              Selected Domain: {selectedDomain}
            </div>
            <div className="right-header-group"> {/* New group for right-aligned items */}
              <div className="header-section level-display">
                Level: <span>{currentLevel} / {gameData.levelsToWin}</span>
              </div>
              <div className="header-section timer-display">
                <Clock /> {formatTime(timeLeft)}
              </div>
              {/* Reset Game Button */}
              <button onClick={resetGame} className="reset-game-button">
                <RotateCcw size={16} /> Reset Game
              </button>
            </div>
          </div>

          <div className="puzzle-section">
            <div className="question-box">
              {currentQuestion}
            </div>
            <div className="drag-drop-areas">
              {/* Shuffled Steps Area (Left) */}
              <div
                className="shuffled-steps-area"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'shuffled')}
              >
                <div className="area-title">Drag From Here</div>
                {shuffledSteps.map(step => (
                  <div
                    key={step.id}
                    className="puzzle-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, step, 'shuffled')}
                  >
                    <div className="puzzle-item-title">{step.title}</div>
                    <div className="puzzle-item-description">{step.description}</div>
                    <span className={`phase-tag ${getPhaseColorClass(step.phase)}`}>{step.phase}</span>
                  </div>
                ))}
              </div>

              {/* Arranged Steps Area (Right) */}
              <div
                className="arranged-steps-area"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'arranged')}
              >
                <div className="area-title">Arrange Here</div>
                {arrangedSteps.map(step => (
                  <div
                    key={step.id}
                    className="puzzle-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, step, 'arranged')}
                  >
                    <div className="puzzle-item-title">{step.title}</div>
                    <div className="puzzle-item-description">{step.description}</div>
                    <span className={`phase-tag ${getPhaseColorClass(step.phase)}`}>{step.phase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="submit-button-container">
            <button
              onClick={() => checkSolution(arrangedSteps)}
              className="submit-button"
              disabled={arrangedSteps.length !== correctSteps.length}
            >
              Check Solution
            </button>
          </div>

          {showGameMessage && (
            <div className="game-message-overlay">
              <div className="game-message-card">
                {gameMessageIcon}
                <h2 className="game-message-title">{gameMessageTitle}</h2>
                <p className="game-message-text">{gameMessageText}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Game Completed State */}
      {gameState === 'completed' && (
        <div className="completed-container">
          <div className="completed-card">
            <Trophy className="completed-icon" />
            <h1 className="completed-title">Game Over!</h1>
            <p className="completed-score">Final Score: {score}</p>
            <p className="completed-score">Total Puzzles Mastered: {totalPuzzlesCompleted}</p>

            <div className="workflow-mastered-box">
              <h3>Workflows you mastered:</h3>
              <ul>
                {gameData.domains.map(domain => {
                  const domainPuzzles = domain.stages.flatMap(stage => stage.puzzles);
                  const completedPuzzles = domainPuzzles.filter(p =>
                    completedPuzzlesInSession.includes(p.id)
                  );
                  if (completedPuzzles.length === 0) return null;

                  return (
                    <li key={domain.name}>
                      <strong>{domain.name}</strong>
                      <ul>
                        {completedPuzzles.map(p => (
                          <li key={p.id}>{p.question}</li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>


            <button onClick={() => setGameState('menu')} className="play-again-button">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendingPuzzleRace;
