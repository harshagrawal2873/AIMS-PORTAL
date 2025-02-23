"use client";

const Map = () => {
  return (
    <div className="rounded-md overflow-hidden shadow-md">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.081054629887!2d75.86683788885496!3d22.7252285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd13ed2bae49%3A0xb884fc340de875c6!2sShri%20Govindram%20Seksaria%20Institute%20of%20Technology%20and%20Science!5e0!3m2!1sen!2sin!4v1740251039327!5m2!1sen!2sin"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="SGSITS Location Map"
      ></iframe>
    </div>
  );
};

export default Map;
