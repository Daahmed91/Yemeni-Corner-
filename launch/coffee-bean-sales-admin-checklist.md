# Coffee Bean Sales Launch Admin Checklist

Use this checklist before promoting the coffee online or in cafe. Do not publish the 2-bag free-shipping message unless the matching Shopify discount is active.

## Storefront Routing

- Create a Shopify collection:
  - Title: `Shop Coffee`
  - Handle: `coffee`
  - Product: `Yemeni Corner Signature Blend`
  - Availability: Online Store enabled
- Verify:
  - `https://www.yemenicorner.ca/collections/coffee` returns 200.
  - Header and footer `Shop Coffee` links go to `/collections/coffee`.
  - Until the collection is live, Header, Footer, cart empty state, and 404 fallback should point buyers to `/products/yemeni-corner-harraz-signature-roast`.
  - After the collection is live, clear or update the Header/Footer `Shop Coffee navigation link` setting so it uses `/collections/coffee`.

## Product Admin Alignment

- Product title: `Yemeni Corner Signature Blend`
- Product handle: `yemeni-corner-harraz-signature-roast`
- Vendor: `Yemeni Corner`
- Product type: `Coffee`
- Tags: `coffee`, `medium roast`, `whole bean`, `yemeni coffee`
- Price: `$32.99 CAD`
- Variant: single default variant unless grind or bundle variants are intentionally added later.
- Inventory: track quantity and confirm available inventory supports at least `25-40 bags/week`.

Remove or replace any broad admin copy such as `Sourced from the legendary Harraz mountains` unless the exact supplier record supports that wording. Shopify admin content, product SEO fields, product metafields, feeds, and checkout settings are the source of truth for launch claims and offers.

## Product Metafields For Verified Batch Claims

Populate these product metafields from supplier records only:

| Metafield | Required value |
| --- | --- |
| `custom.bag_size` | `340 g whole bean` |
| `custom.tasting_notes` | `Warm spice, cocoa, dried fruit` |
| `custom.roast_level` | Exact roast level from batch record |
| `custom.roast_date` | Exact roast date or batch date text |
| `custom.coffee_process` | Exact process from supplier record |
| `custom.origin_importer` | Exact farm/region/importer record |
| `custom.origin_context` | One short supplier-backed origin sentence |
| `custom.brew_methods` | `Drip, French press, pour-over, espresso` |
| `custom.shipping_returns` | `Buy 2 bags to unlock free standard shipping in Canada or the United States at checkout. Returns follow the store policy for sealed coffee.` |
| `custom.verified_seo_description` | Safe SEO copy using only verified claims |
| `custom.verified_structured_description` | Safe Product JSON-LD copy using only verified claims |

## 2-Bag Free Standard Shipping Discounts

- Create two automatic shipping discounts limited to the Signature Blend product:
  - `2-bag free standard shipping — Canada`: Canada only, minimum quantity 2, maximum shipping price `$12.00 CAD`.
  - `2-bag free standard shipping — United States`: United States only, minimum quantity 2, maximum shipping price `$29.90 CAD`.
- For both discounts:
  - Customer eligibility: all customers.
  - Usage limit: one use per customer.
  - Active dates: launch day onward.
  - Combinations: off by default unless another planned promotion requires them.
  - Express shipping remains paid because its rate exceeds the discount cap.
- QA before launch with separate Canada and U.S. addresses:
  - 1 qualifying bag: shipping is charged.
  - 2 qualifying bags: standard shipping is free.
  - Express shipping remains paid.
  - Non-qualifying products do not count toward the two-bag threshold.
- Retire the legacy cart-value free-shipping rates (`$75 CAD` Canada and `$100 CAD` U.S.) only after both live checkout tests pass.

## Shopify Admin Setup

- Markets: Canada and United States enabled; the U.S. market uses automatic local-currency pricing.
- Shipping: Canada and U.S. rates active; packaging weight entered for one bag and two bags.
- Taxes and duties: Shopify-managed settings reviewed for both markets.
- Policies: shipping, refund, privacy, and terms pages published.
- Returns: sealed coffee policy is visible before checkout or linked from policy pages.
- Fulfillment: packing materials, labels, roast/batch sticker process, and pickup/shipping handoff confirmed.

## Analytics And Product Feed

- Connect the Shopify Google and YouTube channel.
- Connect GA4 to Shopify through the Google and YouTube channel.
- Connect or create Google Merchant Center and sync the coffee product.
- Check Shopify Customer Events:
  - `product_viewed`
  - `product_added_to_cart`
  - `checkout_started`
  - `checkout_completed`
- Avoid duplicate purchase tracking. Use Shopify Customer Events or the official Google channel as the purchase source of truth.
- Verify theme helper events:
  - `view_item`
  - `add_to_cart`
  - `begin_checkout`
  - `newsletter_signup`
  - `phone_click`
  - `directions_click`
  - `menu_view`

## Launch QA Gate

Launch promotion only after these pass:

- Product page loads on mobile and desktop.
- Add to cart opens the mini cart and updates the count.
- Cart page quantity changes work.
- Checkout starts from cart drawer and cart page.
- 1-bag and 2-bag free-shipping behavior is correct.
- Purchase event is visible after a real low-risk test order.
- `/collections/coffee`, `/pages/menu`, `/pages/contact`, `/cart`, and legacy redirects work.
- Product meta description and Product JSON-LD do not contain unverified sourcing claims.
