# ImageKit.io Integration Specification

## 1. Overview
ImageKit is used to store and deliver bakery logos, website banners, product catalog photos, and customer-uploaded custom cake reference images with real-time transformations and CDN delivery.

## 2. Secure Upload Flow
1. Client requests upload authorization:
   `GET /api/v1/integrations/imagekit/auth`
2. Backend computes time-stamped HMAC-SHA1 signature using `IMAGEKIT_PRIVATE_KEY` and returns:
   ```json
   {
     "token": "d7486e92-...",
     "expire": 1791720000,
     "signature": "3df47bc..."
   }
   ```
3. Client uploads the image file directly to ImageKit's upload API using the signature.
4. Client sends the resulting `url` and `fileId` back to BMS backend to associate with the `Product` or `OrderItemCustomization`.

Private credentials are never leaked to the client browser bundle.
