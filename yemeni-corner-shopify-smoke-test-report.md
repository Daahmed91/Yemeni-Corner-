# Yemeni Corner Shopify Theme Smoke Test Report

Generated: June 3, 2026  
Workspace: `C:\Users\Ahmed\Documents\Yemeni Corner site`  
Scope: local Shopify theme files, existing theme ZIP, and public `https://www.yemenicorner.ca/` reference site.

## Executive Summary

The local Shopify theme is structurally coherent: section schemas parse, template section references resolve, snippet references resolve, asset references resolve, and locale keys used in Liquid exist.

The biggest launch blocker is packaging. The existing `yemeni-corner-theme-shopify-valid.zip` is stale and should not be uploaded. It is missing current assets and sections, including product/cafe imagery, `cart-drawer.liquid`, `gift-ritual.liquid`, `heritage-timeline.liquid`, `menu-page.liquid`, and `cafe-favorites.liquid`.

The next highest risk is store setup alignment. Several CTAs and product pickers reference `/products/yemeni-corner-harraz-signature-roast`. If the Shopify product is created from the README title `Yemeni Corner Signature Blend` without manually setting the handle to `yemeni-corner-harraz-signature-roast`, product CTAs and featured-product lookups can fail or fall back incorrectly.

The public domain is reachable, but it appears to be the current cafe website rather than this local Shopify theme. I could not perform a real Shopify storefront preview, cart mutation, or checkout handoff because Shopify CLI, npm, Ruby, Theme Check, Python, LibreOffice, and browser automation were unavailable in this environment.

## Test Constraints

These checks could not be completed in the current environment:

| Blocked check | Reason |
|---|---|
| `shopify theme check` | `shopify`, `npm`, `ruby`, and `theme-check` commands are not installed. |
| Shopify theme preview | Shopify CLI is unavailable and no preview/store URL was configured in the repo. |
| Add-to-cart and checkout browser test | No Shopify preview session and in-app browser connection failed in this sandbox. |
| Visual responsive browser QA | Browser automation failed; only static CSS/source checks and public page fetches were possible. |
| DOCX visual render QA | `python`, `py`, `pandoc`, and `soffice` are not installed. This report is delivered as Markdown. |

## Smoke Test Coverage

| Area | Result | Notes |
|---|---:|---|
| Theme file structure | Pass | Expected Shopify folders are present: `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`. |
| JSON templates/config | Pass with Shopify comment handling | Strict JSON parsing fails on Shopify-generated `/* ... */` header comments, but all JSON parsed after stripping those comments. |
| Section schemas | Pass | All `sections/*.liquid` schema blocks parsed as JSON. |
| Template section references | Pass | Every template/group section type maps to an existing `sections/*.liquid` file. |
| Snippet references | Pass | All `{% render '...' %}` references map to existing snippets. |
| Asset references | Pass | All Liquid `asset_url` references map to existing local files. |
| Locale keys | Pass | All detected translation keys have entries in `locales/en.default.json`. |
| Template setting compatibility | Pass | Template section and block setting IDs match section schemas. |
| Existing ZIP package | Fail | ZIP is stale and missing major current files. Regenerate before upload. |
| Product setup | Risk | Hard-coded product handle must match real Shopify product handle. |
| Navigation setup | Risk | Curated nav ignores admin menu and sends Shop Coffee to all-products collection. |
| Cart/add-to-cart source review | Partial | Source is present, but real Shopify cart behavior needs preview testing. |
| Public domain reachability | Partial pass | Home, contact, menu, careers, and online ordering pages are reachable by fetch. The public site does not appear to be this Shopify theme. |
| Accessibility static checks | Mixed | Good skip link/focus patterns exist, but gold accent text contrast is low and menu filter tab semantics need refinement. |

## Findings Register

| ID | Priority | Area | Finding | Evidence | Recommended fix |
|---|---|---|---|---|---|
| F01 | Critical | Packaging | Existing ZIP is stale and should not be uploaded. | Current theme has 76 theme files; ZIP has 54 files. ZIP is missing 23 current files and includes stale `snippets/meta-tags.liquid`. | Regenerate the package from the current working tree after fixes. Confirm the ZIP includes all required `assets`, `sections`, `snippets`, `templates`, `layout`, `config`, and `locales` files. |
| F02 | High | Product links | Product CTAs and product pickers depend on `yemeni-corner-harraz-signature-roast`. | `templates/index.json`, `templates/page.menu.json`, `templates/page.story.json`, `sections/header-group.json`, and `templates/product.json` reference this handle. README product title would normally produce a different default handle unless set manually. | Either set the Shopify product handle exactly to `yemeni-corner-harraz-signature-roast`, or update all theme references to the final product handle. Prefer product picker settings plus blank manual links where possible. |
| F03 | High | Environment/QA | Shopify validation and preview could not run. | `shopify`, `npm`, `ruby`, and `theme-check` commands are missing. | Install Shopify CLI and Theme Check, then run `shopify theme check` and `shopify theme dev --store <store>.myshopify.com`. Re-run cart, checkout, mobile, and console smoke tests in a real preview. |
| F04 | Medium | Navigation | Curated nav ignores the admin `main-menu` and sends Shop Coffee to `/collections/all`. | `sections/header.liquid` uses `routes.all_products_collection_url` when `use_curated_navigation` is true. `sections/header-group.json` sets `use_curated_navigation` to true. README recommends a `coffee` collection and says to update the admin menu. | Point curated Shop Coffee links to `/collections/coffee`, expose a section setting for the collection URL, or disable curated navigation so the admin menu controls the link. |
| F05 | Medium | Packaging config | `.shopifyignore` excludes `templates/policy.json`, while README says policy templates are included. | `.shopifyignore` contains `templates/policy.json`; README lists policy templates as included. | Decide whether policy template should upload. If yes, remove it from `.shopifyignore`; if no, update README. |
| F06 | Medium | Accessibility | Gold accent text on warm white is likely under WCAG contrast for normal text. | Static contrast check: `#C28839` on `#FFFDF8` is about 3.0:1. `.eyebrow` uses gold at `0.73rem`. | Darken the gold used for text, use brown for small eyebrow text, or reserve gold for borders/large decorative text only. Target at least 4.5:1 for normal text. |
| F07 | Medium | Accessibility/interaction | Menu filter controls use `role="tablist"` and `role="tab"` but do not implement full tab keyboard behavior or tab panels. | `sections/menu-page.liquid` assigns tab roles. `assets/theme.js` toggles only `aria-selected` and `is-hidden`. | Either implement tab keyboard expectations and associated panels, or remove tab roles and use plain filter buttons with `aria-pressed`. |
| F08 | Medium | Checkout | Cart drawer uses a hard-coded `/checkout` link. | `snippets/cart-drawer.liquid` links directly to `/checkout`. | Verify in Shopify preview. Consider using Shopify route-aware checkout behavior or keep checkout behind the cart form when locale/market routing matters. |
| F09 | Medium | Shopify content files | Home template references a Shopify-hosted image that must exist in the store admin. | `templates/index.json` references `shopify://shop_images/ChatGPT_Image_Jun_3_2026_12_50_52_AM_b916f429-bf03-4314-bdac-a4705fa917a7.png`. | Confirm this file exists in Shopify content files after upload, or replace with a theme asset/image picker value available in the store. |
| F10 | Medium | Public live site | Public `yemenicorner.ca` does not appear to show this Shopify theme or Signature Blend Shopify commerce path. | Fetched public home/contact/menu/ordering pages show current cafe content and Wix-style ordering/careers surfaces, not the local Shopify product-focused theme. | Confirm the intended Shopify preview or production URL. If `yemenicorner.ca` is meant to be Shopify, publish/connect the Shopify storefront before final live smoke testing. |
| F11 | Low | Public live site content | Footer copyright appears outdated. | Public pages fetched on June 3, 2026 show `© 2023 by Yemeni Corner Coffee House`. | Update footer year or make it dynamic. |
| F12 | Low | Public live site ordering | Online ordering page says `Not Accepting Orders` while still showing ordering controls. | Public `/online-ordering` page fetched on June 3, 2026 shows `Not Accepting Orders`, `View Cart (0)`, and `Order Now`. | If ordering is intentionally closed, make the page state clearer. If it should be open, fix availability/settings. |
| F13 | Low | Public live site content | Menu/copy has visible typos and generic image labels in fetched text. | Public menu includes `Latte's`, `cardamon`, and `Hazulnut honey buns`; fetched pages expose image labels such as `Image` and filename-like labels. | Clean spelling and verify image alt text/accessibility labels on the live public site. |
| F14 | Low | Testimonials/content claims | Theme testimonials are generic and may read like placeholders. | `templates/index.json` uses authors like `Yemeni Corner guest`, `Cafe regular`, and `Home brewer`. | Replace with verified testimonials, remove the section, or relabel as non-review brand copy. |

## Packaging Details

Existing ZIP comparison:

| Metric | Count |
|---|---:|
| Current theme files under Shopify folders | 76 |
| Files in `yemeni-corner-theme-shopify-valid.zip` | 54 |

Files missing from the ZIP:

```text
assets\yc-cafe-adeni-tea.webp
assets\yc-cafe-mufawar.webp
assets\yc-cafe-pistachio-latte.webp
assets\yc-cafe-saffron-milk-cake.webp
assets\yc-cafe-tawahi-lemonade.webp
assets\yc-cafe-yemeni-latte.webp
assets\yc-hero-ritual.webp
assets\yc-signature-blend-gift.webp
assets\yc-signature-blend-product.webp
assets\yemeni-corner-logo-dark.png
assets\yemeni-corner-logo-header.png
assets\yemeni-corner-logo-horizontal-dark.png
assets\yemeni-corner-mark.png
assets\yemeni-corner-official-logo.png
assets\yemeni-corner-official-logo-label.png
assets\yemeni-corner-ritual.webp
assets\yemeni-corner-social-share-1200x628.jpg
assets\yemeni-corner-social-share-1200x628.png
sections\cafe-favorites.liquid
sections\gift-ritual.liquid
sections\heritage-timeline.liquid
sections\menu-page.liquid
snippets\cart-drawer.liquid
```

Extra stale file in the ZIP:

```text
snippets\meta-tags.liquid
```

## Public Site Fetch Observations

Fetched public URLs:

```text
https://www.yemenicorner.ca/
https://www.yemenicorner.ca/contact-us
https://www.yemenicorner.ca/menus
https://www.yemenicorner.ca/careers
https://www.yemenicorner.ca/online-ordering
https://www.yemenicorner.ca/blog
```

Observed public-site smoke results:

| Page | Result | Notes |
|---|---:|---|
| Home | Reachable | Shows current cafe site content, not the local Shopify Signature Blend theme. |
| Contact | Reachable | Form fields are present in fetched text. Visual/form submission not tested. |
| Menus | Reachable | Menu category links and menu items are present. Copy cleanup needed. |
| Careers | Reachable | Application form fields are present in fetched text. Upload/submission not tested. |
| Online ordering | Reachable with concern | Page says `Not Accepting Orders`; order controls still appear. |
| Blog | Reachable | Posts are visible in fetched search results. |

## Deferred Smoke Test Checklist

Run this after installing Shopify CLI and connecting a preview store:

1. Run `shopify theme check`.
2. Run `shopify theme dev --store <store>.myshopify.com`.
3. Verify home, product, collection, cart, search, blog, article, 404, password, story, menu, locations, and contact templates.
4. Confirm all hard-coded product links resolve, especially `/products/yemeni-corner-harraz-signature-roast`.
5. Confirm the `coffee` collection exists and header/footer Shop Coffee links go to the intended page.
6. Add product to cart from product page; verify mini cart opens, cart count updates, subtotal updates, and drawer close/focus behavior works.
7. Test cart page quantity increase/decrease, update cart, remove item, cart note, empty cart, and checkout handoff.
8. Test contact and newsletter form validation, success, and error states.
9. Test mobile nav open/close, Escape close, focus trapping, and return focus.
10. Test menu filters with mouse and keyboard.
11. Test search query, no-results state, and result links.
12. Check desktop/tablet/mobile layouts at common widths: 1440, 1024, 768, 390, and 360 px.
13. Check browser console for JavaScript errors.
14. Validate Product, WebSite, and CafeOrCoffeeShop structured data after the theme is connected to the final Shopify domain.
15. Run a full accessibility pass for contrast, labels, focus order, keyboard operation, and image alt text.

## Static Audit Commands Run

The following source-level audits were run locally:

```text
JSON parse after Shopify generated comment stripping
Section schema JSON parse
Template section type reference check
Snippet render reference check
Liquid asset_url reference check
Locale translation key check
Template section/block setting compatibility check
Existing ZIP vs current theme file comparison
Hard-coded internal URL inventory
Static color contrast spot check
PNG/JPG image dimension check
Key WebP visual sample via local image viewer
```

## Recommended Fix Order

1. Regenerate the theme ZIP from the current working tree; do not upload the existing ZIP.
2. Decide and lock the product handle. Update either Shopify product setup or all hard-coded theme links.
3. Fix Shop Coffee navigation to use the intended `coffee` collection or admin menu.
4. Install Shopify CLI/Theme Check and run real Shopify preview smoke tests.
5. Fix accessibility contrast and menu filter semantics.
6. Confirm Shopify-hosted image references, final product photography, and social share imagery.
7. Clean public-site content issues if the current public domain remains live during transition.

## June 5, 2026 Follow-Up

Live fetches on June 5, 2026 show `https://www.yemenicorner.ca/` and `/products/yemeni-corner-harraz-signature-roast` now rendering the Shopify-style Signature Blend storefront. The product handle risk is therefore lower on the live site, but it still needs a real checkout test in Shopify.

Theme-side follow-up changes made after this report:

- Added a 404 fallback for legacy paths: `/contact-us`, `/menus`, `/online-ordering`, and `/this-is-us`.
- Added `launch/shopify-url-redirects.csv` for Shopify admin URL redirect import.
- Disabled the homepage testimonial section until verified quotes are available.
- Changed cafe menu filters from incomplete tab semantics to pressed filter buttons.
- Changed the cart drawer checkout action from a hard-coded `/checkout` link to the Shopify cart form checkout submit path.
- Removed `templates/policy.json` from `.shopifyignore` and excluded non-theme launch/report files from Shopify uploads.
- Generated `yemeni-corner-theme-current-2026-06-05.zip` from the current theme folders. It contains 82 theme files, with 0 missing and 0 extra files compared with the working tree.

Still admin-only or environment-blocked:

- Import Shopify URL redirects and remove/unpublish any legacy pages that still render old Wix-style content.
- Run `shopify theme check`; `shopify`, `npm`, and `ruby` are still unavailable in this local environment.
- Run a real add-to-cart and checkout handoff test on the live or preview Shopify store.
- Treat `yemeni-corner-theme-current-2026-06-05.zip` as complete but not fully validated until Theme Check and live checkout QA pass.

## June 6, 2026 Follow-Up

Additional theme-side launch cleanup:

- Added configurable Header and Footer `Shop Coffee navigation link` settings and set the curated navigation default to `/collections/coffee`.
- Added a darker `--color-gold-text` token for small readable labels. Contrast is 5.51:1 on `#FFFDF8` and 4.57:1 on `#F5E6D3`.
- Normalized CSS `letter-spacing` declarations to `0`.
- Cleared default `shopify://shop_images` references from the home template so bundled theme assets provide the default hero and cafe favorite imagery.
- Updated both menu filter sections to use pressed filter buttons instead of incomplete tab semantics.
- Removed stored generic homepage testimonial blocks while keeping the section disabled.
- Updated the theme support URL from legacy `/contact-us` to `/pages/contact`.

Still admin-only or environment-blocked after this pass:

- Confirm the `/collections/coffee` collection exists and contains the Signature Blend product.
- Import the URL redirects from `launch/shopify-url-redirects.csv`.
- Run `shopify theme check` and live checkout QA once Shopify CLI/admin access is available.
