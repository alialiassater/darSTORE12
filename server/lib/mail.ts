import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.daralibenzid.dz",
  port: 25,
  secure: false, // Port 25 is typically non-SSL
  auth: {
    user: "store@daralibenzid.dz",
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
});

export async function sendOrderStatusEmail(to: string, orderDetails: any) {
  const isArabic = true; // Default to Arabic for now as per project theme
  
  const subject = isArabic 
    ? `تحديث حالة الطلب رقم #${orderDetails.id}`
    : `Order Status Update #${orderDetails.id}`;

  const statusMap: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "تم الإلغاء",
  };

  const statusLabel = statusMap[orderDetails.status] || orderDetails.status;

  const html = `
    <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #1a4731; text-align: center;">دار علي بن زيد للطباعة والنشر</h2>
      <hr />
      <p>مرحباً <strong>${orderDetails.customerName}</strong>،</p>
      <p>تم تحديث حالة طلبك رقم <strong>#${orderDetails.id}</strong> إلى: <span style="color: #e67e22; font-weight: bold;">${statusLabel}</span></p>
      
      <h3>تفاصيل الطلب:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الكتاب</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">الكمية</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">السعر</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails.items.map((item: any) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item.book?.titleAr || 'كتاب'}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${Number(item.unitPrice).toLocaleString()} DZD</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <p style="margin-top: 20px;">
        <strong>المجموع:</strong> ${Number(orderDetails.total).toLocaleString()} DZD <br />
        <strong>العنوان:</strong> ${orderDetails.address}, ${orderDetails.city}, ${orderDetails.wilayaName}
      </p>
      
      <hr />
      <p style="font-size: 12px; color: #777; text-align: center;">شكراً لتسوقكم من دار علي بن زيد للطباعة والنشر</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Dar Ali BenZid Store" <store@daralibenzid.dz>',
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to} for order ${orderDetails.id}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendNewOrderEmail(to: string, orderDetails: any) {
  const subject = `تأكيد طلب جديد رقم #${orderDetails.id}`;

  const html = `
    <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #1a4731; text-align: center;">شكراً لطلبكم من دار علي بن زيد</h2>
      <p>مرحباً <strong>${orderDetails.customerName}</strong>،</p>
      <p>لقد تلقينا طلبك بنجاح. رقم الطلب هو: <strong>#${orderDetails.id}</strong></p>
      <p>حالة الطلب الحالية: <strong>قيد الانتظار</strong></p>
      
      <h3>محتويات الطلب:</h3>
      <ul>
        ${orderDetails.items.map((item: any) => `
          <li>${item.book?.titleAr || 'كتاب'} (الكمية: ${item.quantity}) - ${Number(item.unitPrice).toLocaleString()} DZD</li>
        `).join('')}
      </ul>
      
      <p><strong>الإجمالي:</strong> ${Number(orderDetails.total).toLocaleString()} DZD</p>
      <p>سنتصل بك قريباً لتأكيد الشحن.</p>
    </div>
  `;

  try {
    // Send to customer
    await transporter.sendMail({
      from: '"Dar Ali BenZid Store" <store@daralibenzid.dz>',
      to,
      subject,
      html,
    });

    // Send copy to admin
    await transporter.sendMail({
      from: '"Store Notification" <store@daralibenzid.dz>',
      to: "store@daralibenzid.dz",
      subject: `طلب جديد وارد: #${orderDetails.id}`,
      html: `<h3>طلب جديد من ${orderDetails.customerName}</h3>` + html,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
}
