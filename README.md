# Yemeni Corner Shopify Theme

Premium Shopify Online Store 2.0 theme for Yemeni Corner, built as a coffee-first storefront for the launch of **Yemeni Corner Signature Blend**.

## What Is Included

- From-scratch Shopify theme structure: `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, and `templates`.
- JSON templates for home, product, collection, pages, blog, article, cart, search, 404, policies, password, and list-collections.
- Alternate page templates for:
- `page.story.json`
- `page.menu.json`
- `page.locations.json`
- `page.south-windsor.json`
- `page.lasalle.json`
- `page.contact.json`
- Premium Yemeni Corner design system using Heritage Gold, Deep Coffee Brown, Cream Sand, Charcoal Gray, and Warm White.
- Sections for hero, signature product, story, brewing guide, cafe menu, locations, testimonials, FAQ, newsletter, contact, and core commerce pages. The testimonial section should stay off the homepage until verified customer quotes are available.
- Production design pass with responsive editorial layouts, premium product staging, richer hover/focus states, mobile drawer accessibility, structured data, and Shopify package hygiene.

## Required Store Setup

### Product

Create one product in Shopify admin:

- Product title: `Yemeni Corner Signature Blend`
- Product type: `Premium Yemeni Coffee`
- Size: `340 g`
- Format: `Whole Bean Coffee`
- Tasting notes: `Warm spice, cocoa, dried fruit`
- Roast level: `Medium`
- Best for: `Drip, French press, pour-over, espresso`
- Description:

```text
A rich and aromatic coffee inspired by Yemen's deep coffee heritage. Smooth, warm, and full of character, this roast is made for slow mornings, family gatherings, and anyone looking for a coffee with a story.
```

Add product photography when available. The theme includes a branded coffee bag placeholder for development only.

For a polished launch, use:

- One clean product packshot on warm neutral background.
- One lifestyle image with brewed coffee, dates, or a home ritual setting.
- One cafe or hospitality image for story/location sections.
- Consistent alt text that describes the subject, not just the brand.

### Collection

Create a collection for the shop page:

- Collection title: `Shop Coffee`
- Suggested handle: `coffee`
- Include the Signature Blend product.

The curated header and footer automatically use the `coffee` collection when a published collection with handle `coffee` exists. Until then, `Shop Coffee` falls back to Shopify's all-products collection so the live shop link still works.

### Pages

Create these pages and assign the matching templates:

- `Story` -> template `page.story`
- `Menu` -> template `page.menu`
- `Locations` -> template `page.locations`
- `South Windsor` -> template `page.south-windsor`, handle `south-windsor`
- `LaSalle` -> template `page.lasalle`, handle `lasalle`
- `Contact` -> template `page.contact`

The templates already include polished section content, so the page body can stay minimal at launch.

If the South Windsor or LaSalle pages are not created yet, the theme will keep footer/location links on the main Locations section instead of linking shoppers to a 404. The `View Location` buttons appear automatically once the matching pages exist.

### Local SEO

After Google Business Profile access is restored, update each location profile with:

- Website URL: `https://www.yemenicorner.ca`
- Menu URL: `https://www.yemenicorner.ca/pages/menu`
- Location page URLs: `/pages/south-windsor` and `/pages/lasalle`
- Final hours, phone, description, cafe photos, and weekly posts

The theme includes standalone local landing page templates with address, hours, phone CTA, directions CTA, map embed, photo strip, menu CTA, and internal links.

### Analytics And Pixels

Use a dedicated GA4 property named `Yemeni Corner`, then connect it through Shopify's Google & YouTube app. Do not connect the store to unrelated GA accounts.

The theme publishes storefront helper events through `Shopify.analytics.publish` when available and also pushes them to `window.dataLayer`:

- `view_item`
- `add_to_cart`
- `begin_checkout`
- `newsletter_signup`
- `phone_click`
- `directions_click`
- `menu_view`

For a custom Shopify Customer Events pixel, use Shopify's standard events as the source of truth for commerce and map them to GA4 names only once:

- `product_viewed` -> `view_item`
- `product_added_to_cart` -> `add_to_cart`
- `checkout_started` -> `begin_checkout`
- `checkout_completed` -> `purchase`

The local CTA events are theme-published custom events. Purchase tracking must be handled by Shopify Customer Events or the Google & YouTube app because the theme does not render the order confirmation page.

References:

- https://help.shopify.com/en/manual/online-sales-channels/google/getting-setup/connect
- https://help.shopify.com/en/manual/promoting-marketing/pixels
- https://shopify.dev/docs/api/web-pixels-api/emitting-data

### Navigation

Create or update the `main-menu` navigation:

- Home
- Shop Coffee
- Story
- Menu
- Locations
- Journal
- Contact

The South Windsor and LaSalle pages are linked from the location cards and footer. Add them to the main menu only if you disable the curated navigation setting or intentionally want more top-level links.

Create or update the `footer` navigation with the same core links plus policies.

### Legacy URL Redirects

Import `launch/shopify-url-redirects.csv` in Shopify admin under URL redirects:

- `/contact-us` -> `/pages/contact`
- `/menus` -> `/pages/menu`
- `/online-ordering` -> `/pages/menu`
- `/this-is-us` -> `/#story`

These should be configured as Shopify URL redirects so shoppers and search engines receive a real redirect. The theme also includes a 404 fallback for the same legacy paths, but that only helps if Shopify is already serving those old paths as 404 pages. If an old Wix-style page still renders at one of those paths, remove or unpublish that legacy page in admin after the redirect is created.

### Markets, Shipping, And Tax

For v1, configure these in Shopify admin:

- Market: Canada only
- Shipping zones: Canada only
- Taxes: Shopify-managed Canada tax setup
- Subscriptions: disabled for v1
- Cafe menu ordering: not enabled in this theme

## Local Development

This machine did not have Ruby, Theme Check, or Shopify CLI available when the theme was scaffolded. Install Shopify CLI before previewing:

```powershell
npm install -g @shopify/cli @shopify/theme
shopify version
```

Then run:

```powershell
shopify theme check
shopify theme dev --store your-store.myshopify.com
```

To upload as an unpublished theme:

```powershell
shopify theme push --unpublished --store your-store.myshopify.com
```

## QA Checklist

- Run `shopify theme check`.
- Import and test the legacy URL redirects listed in `launch/shopify-url-redirects.csv`.
- Preview home, product, collection, cart, story, menu, locations, contact, blog, article, search, and 404 pages.
- Test add to cart, quantity updates, cart note, checkout handoff, and empty cart state.
- Confirm the cart drawer checkout button posts through the Shopify cart form rather than a hard-coded `/checkout` link.
- Check mobile navigation, keyboard focus, form labels, color contrast, and image alt text.
- Keep testimonials disabled until each quote and attribution is verified.
- Replace development placeholder imagery with final product and lifestyle photography before launch.
- Verify Product and WebSite structured data in a rich results validator after the theme is connected to the live Shopify domain.
- Confirm `*.zip`, `.env`, local Shopify state, and development-only files are excluded before pushing the theme.
