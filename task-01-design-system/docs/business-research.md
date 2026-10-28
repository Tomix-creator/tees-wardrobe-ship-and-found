# Tee’s Wardrobe — Business Research & Owner Interview

This document compiles the primary qualitative business research conducted with the owner of Tee’s Wardrobe. It preserves the exact questions and answers recorded in the source discovery interview (`QA.docx`) as historical evidence, documents later owner clarifications, separates our proposed interface and calculation rules, and distinguishes owner wishes from implemented realities.

> **Note on File Organization**: This document is the dedicated business-research record for owner interview data. It is kept distinct from `docs/interview-answers.md`, which is reserved for the 12 technical interview-defence questions in Task One.

---

## 1. Primary Owner Interview (Source Transcript)

*Source: `QA.docx` — initial stakeholder discovery session. Preserved verbatim as historical evidence.*

### Question 1: Recurring Customer Questions
**Q: What do customers ask you repeatedly that only you can answer?**  
**A:**  
- How much do I still owe, and have you received my payment?  
- Is my outfit ready, and when can I collect it or get it delivered?  
- Can you make this style again in another size, colour or fabric?  
- How much will this cost, and how long will it take?  
- Can I change or cancel my order?

### Question 2: Record-Keeping Methods
**Q: What records do you keep, and where do they live now?**  
**A:** Records are kept in a note on my phone.

### Question 3: Data Deletion Requests
**Q: Has a customer ever asked you to delete their information, and what did you do?**  
**A:** No. No customer has ever asked for their information to be deleted.

### Question 4: Risk of Data Loss
**Q: What would you do if your records were lost tomorrow?**  
**A:** I would feel very bad and honestly does not know what I would do. There is currently no backup or recovery plan.

### Question 5: Software Rejection Criteria
**Q: What would make you not use software like this?**  
**A:** Cost, if it is too expensive for a new business and it is hard to learn or slow to use on a phone.

### Question 6: Business Offerings & Products
**Q: What does Tee’s Collection sell or do?**  
**A:** Mainly ready-to-wear clothing, including kimonos, two-piece sets and bubu gowns.

### Question 7: End-to-End Order Walkthrough
**Q: Walk me through one recent order, from the customer’s first message until the clothes were collected.**  
**A:** A customer from the my church sent a direct message (DM) asking for a ready-to-wear piece. They agreed on the order, the customer sent the money, and the owner started work straight away. The finished clothes were delivered to the customer rather than collected.

### Question 8: Pricing, Payment Tracking & Cancellations
**Q: How do you agree on prices, record payments and work out what a customer still owes? What happens when an order changes or is cancelled?**  
**A:** Prices are agreed by compromise between the owner and the customer. There is no system yet for recording payments, and I want to set one up. There is no process for changed or cancelled orders; nothing is done about them at the moment.

### Question 9: Operations & Staffing
**Q: Who handles orders, measurements and payments? Is there information some workers should not see or change?**  
**A:** I handle everything because the business has only just started. There are no other workers yet, so no access restrictions are needed for now.

### Question 10: Friction Points & Payment Confusion
**Q: Tell me about the last time an order was delayed, a record was wrong, or a payment caused confusion. What happened and how did you fix it?**  
**A:** A customer pays part of the price by transfer and later says she has paid more than the owner remembers. Because payments are only noted in a phone note, I couldn’t quickly see what was paid, when, and what is still owed. The customer and the owner have to work it out together.  
- **Can you give me a recent example?**  
  A customer agreed a price with the owner through a DM, paid a first amount, and paid the rest later. When it came to delivery, the customer’s idea of the balance was different from the mine.  
- **What happened next?**  
  I went back through my phone note and the payment messages to find each payment, then checked the total with the customer. Once we both agreed what had been paid, the balance was corrected and the outfit was delivered, a little later than planned.  
- **How do you handle that today?**  
  No actual way.  
- **Which part takes the most effort?**  
  Working out what a customer has actually paid and what she still owes. This means searching through the note and old messages, then confirming the figure with the customer, which can feel awkward.

---

## 2. Later Owner Clarifications

*The following items represent subsequent clarifications provided by the business owner, expanding on and correcting earlier discovery answers:*

1. **Clarification on Payment Confusion (Question 10)**:
   - The payment-confusion story is **unconfirmed: Tee is not sure it really happened**.
   - She views the earlier story as a possible example of what could go wrong when tracking installment payments informally, rather than a verified historical event.
   - **Status**: Described as unconfirmed; it is not presented as a confirmed incident, nor is it asserted that no dispute has ever happened.

2. **Mixture of Ready-Made & Made-to-Order Items (Question 6 & 9)**:
   - The business offers a **mixture of ready-made clothing and made-to-order pieces** (including kimonos, two-piece sets and bubu gowns).
   - **When measurements are used**: Standard sizing applies to ready-made items. Customer body measurements are taken and recorded specifically when garments are **made to order, customized, or tailored for specific customer fit**.

3. **Current Record-Keeping Methods (Question 2 & 8)**:
   - Earlier notes described records residing simply in a "phone note." The owner clarifies that current records actually live across a **physical paper notebook and informal WhatsApp chats**.
   - **Inconsistencies**: Delivery charges and payment dates are **not always recorded consistently**.
   - Bank transfers are verified manually using the mobile banking application.

4. **Fulfillment: Delivery Quoting & Collection (Question 1 & 7)**:
   - **Delivery Pricing**: Delivery fees are quoted based on the specific customer destination and **agreed before payment**.
   - **Collection**: Customer collection (in-person pickup) is also available as an established fulfillment option alongside courier delivery.
   - **Payment Collection**: **Tee’s Wardrobe receives delivery payments directly** from the customer once quoted; delivery fees are not left as cash-on-delivery payments to the courier.

5. **Changes and Cancellations (Question 8)**:
   - Order changes and cancellation requests are considered **case by case**, and there is **no set deposit or refund rule yet**.
   - Requests are not automatically accepted or refused.

6. **Operations, Staffing & Access Control (Question 9)**:
   - **Distinction between Owner Preferences and Current Demonstration**:
     * **Tee’s Preference for Future Helpers**: Future helpers may see orders and delivery details; measurements and payment details should be limited to the owner or someone who needs them.
     * **Current Software Scope**: The current demonstration does not implement sign-in or role-based access controls. (No claims are made regarding the security of Tee’s notebook, WhatsApp, or bank app.)

7. **Customer Research & Technical Assumptions (Question 5)**:
   - **Customers have not been interviewed**: All customer persona attributes, device capabilities, and communication preferences reflect the owner's impressions rather than direct customer research.
   - **Owner Guesses vs. Confirmed Needs**: The owner’s assumptions that customers would prefer simpler WhatsApp links over web logins, or that customers frequently suffer from unreliable mobile data, are **the owner’s personal guesses**, not verified customer requirements.

8. **Brand Visual Identity**:
   - Trading Name: **Tee’s Wardrobe** (verified business name).
   - Logo: **No logo yet**.
   - Brand Color: **Sea green**. The reference swatch was sampled as **sRGB `#32B1AA`**, formally replacing an earlier proposed `#2E8B57` shade.

---

## 3. Proposed Interface & Calculation Rules

The following interface rules, calculation policies, and product scope represent engineering decisions designed to address the owner's operational challenges while respecting current business realities:

1. **Core Balance Calculation Rule**:
   - The primary requirement that must function correctly is establishing the accurate remaining balance for each order:  
     $$\text{Remaining Balance} = \text{Agreed Price} - \text{Confirmed Payments}$$
2. **Strict Separation of Clothing and Delivery**:
   - Clothing prices must remain distinctly separated from delivery charges.
   - An unknown delivery charge must remain visibly marked as **“awaiting quote” / “not yet quoted”**.
   - An unknown delivery charge must **never** be treated, assumed, or displayed as zero (₦0.00) or free.
3. **Full Agreed Charge Structure**:
   - Once a courier quote is obtained and agreed, the full agreed charge is calculated as:  
     $$\text{Total Agreed Charge} = \text{Clothing Agreed Price} + \text{Delivery Charge}$$
   - If delivery is pending a quote, the total agreed charge remains incomplete and must not claim a definitive final total.
4. **Order Status Demonstration & Policy Tone**:
   - The interface must clearly state that order changes or cancellations are handled case by case with no set deposit or refund rule yet. It must not imply that cancellations are automatically permitted or refused.
   - Demonstration screens must prominently display a disclaimer clarifying that the screen is an order demonstration prototype, not a live payment system.
5. **Product Scope & Exclusions (Version 1)**:
   - Automated cancellations, automated customer refunds, and direct automated bank API integrations are outside Version 1 scope.
   - Recording orders, prices, payments and progress is proposed functionality for the planned application; the current screen is a demonstration and does not provide a working order-recording system. Customer order viewing likewise remains proposed (noting customers have not yet been interviewed).

---

## 4. Status of Open Policies & Technical Uncertainties

1. **Payment-Confusion Experience**:
   - The payment-confusion story is unconfirmed: Tee is not sure it really happened. It is treated as an unconfirmed example rather than a verified event, without asserting that no dispute has ever happened.
2. **Production Model**:
   - Clarified as a mixture of ready-made clothing (standard sizing) and made-to-order garments (measurements recorded).
3. **Record-Keeping Consistency**:
   - Current records are split between a paper notebook and WhatsApp chats. Delivery charges and payment dates are not always recorded consistently.
4. **Fulfillment Flexibility**:
   - Delivery is quoted per destination and agreed prior to payment; customer collection is also an available option.
5. **Change and Cancellation Rules**:
   - Considered case by case; there is no set deposit or refund rule yet. Requests are not automatically accepted or refused.
6. **Access Control & Staff Permissions**:
   - Tee’s preference is that future helpers may see orders and delivery details, while measurements and payment details should be limited to the owner or someone who needs them. The current demonstration does not implement sign-in or role-based access controls.
7. **Customer Needs Validation**:
   - Preferences for simpler WhatsApp links and constraints around unreliable mobile data remain unconfirmed guesses pending direct customer interviews.
