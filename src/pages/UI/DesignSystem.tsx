import React from 'react';
import { FiSearch, FiDownload, FiZap, FiHeart, FiClock, FiActivity, FiUsers, FiMail } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdOutlineAutoAwesome } from 'react-icons/md';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { PageWrapper } from '@/components/layout/PageWrapper';
import type { Recipe, ChatMessage } from '@/types';
import './DesignSystem.css';

/* ── Mock data ─────────────────────────────────────────────────────── */
const MOCK_RECIPE: Recipe = {
  id: 'ds-demo',
  title: 'Honey Garlic Salmon',
  description: 'Pan-seared salmon with a sticky honey garlic glaze. Ready in 20 minutes, high protein.',
  cookingTime: 20,
  calories: 420,
  protein: 38,
  carbs: 18,
  fat: 22,
  servings: 2,
  difficulty: 'Easy',
  cuisineType: 'asian fusion',
  dietaryTags: ['High Protein', 'Gluten-Free'],
  ingredients: [],
  instructions: [],
  aiMatchScore: 94,
  aiTip: 'Pat salmon dry before searing for a perfect golden crust.',
  matchReasons: ['High Protein', 'Under 30 mins'],
  createdAt: new Date().toISOString(),
};

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content: 'What can I cook with salmon and lemon?',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'a1',
    role: 'assistant',
    content: 'Great choice! Here are some quick ideas:\n\n**Honey Garlic Salmon** — Pan-seared with sticky glaze, 20 mins.\n**Lemon Herb Baked Salmon** — Simple, healthy, under 30 mins.\n**Salmon Pasta** — Creamy lemon sauce, crowd-pleaser.\n\nWould you like a full recipe for any of these?',
    timestamp: Date.now() - 30000,
  },
];

/* ── Color data ─────────────────────────────────────────────────────── */
const BRAND_COLORS = [
  { name: 'Primary',       token: '--color-primary',       hex: '#D98C5F', desc: 'Terracotta — CTAs, links, active' },
  { name: 'Primary Light', token: '--color-primary-light', hex: '#E8A87C', desc: 'Hover states' },
  { name: 'Primary Dark',  token: '--color-primary-dark',  hex: '#C07440', desc: 'Pressed states' },
  { name: 'Secondary',     token: '--color-secondary',     hex: '#A8BFA3', desc: 'Sage — accents, tags' },
  { name: 'Secondary Dark',token: '--color-secondary-dark',hex: '#7A9E74', desc: 'Sage pressed' },
  { name: 'Accent',        token: '--color-accent',        hex: '#F0C080', desc: 'Honey — highlights, badges' },
];

const NEUTRAL_COLORS = [
  { name: 'Warm 50',  hex: '#FFF8EF' }, { name: 'Warm 100', hex: '#FAF3E8' },
  { name: 'Warm 200', hex: '#F0E6D4' }, { name: 'Warm 300', hex: '#E0CFBB' },
  { name: 'Warm 400', hex: '#C8B8A0' }, { name: 'Warm 500', hex: '#A89278' },
  { name: 'Warm 600', hex: '#7A6858' }, { name: 'Warm 700', hex: '#4E3E32' },
  { name: 'Warm 800', hex: '#38302A' }, { name: 'Warm 900', hex: '#2F2F2F' },
];

const SEMANTIC_COLORS = [
  { name: 'Success', hex: '#22C55E', token: '--color-success' },
  { name: 'Error',   hex: '#EF4444', token: '--color-error' },
  { name: 'Warning', hex: '#F59E0B', token: '--color-warning' },
  { name: 'Info',    hex: '#3B82F6', token: '--color-info' },
];

const TYPE_SCALE = [
  { label: 'H1 / Display', size: '48px', weight: '700', family: 'Playfair Display', sample: 'Your Personal AI Chef' },
  { label: 'H2 / Title',   size: '36px', weight: '700', family: 'Playfair Display', sample: 'Weekly Meal Planner' },
  { label: 'H3 / Section', size: '28px', weight: '700', family: 'Playfair Display', sample: 'Recipe Ingredients' },
  { label: 'H4 / Card',    size: '22px', weight: '700', family: 'Playfair Display', sample: 'Honey Garlic Salmon' },
  { label: 'Body',         size: '16px', weight: '400', family: 'Inter',            sample: 'Pan-seared salmon with a sticky honey garlic glaze. Ready in just 20 minutes.' },
  { label: 'Body SM',      size: '14px', weight: '400', family: 'Inter',            sample: 'Quick & Easy · 20 mins · 420 kcal · High Protein' },
  { label: 'Caption',      size: '12px', weight: '500', family: 'Inter',            sample: 'DIETARY TAGS · AI MATCH · LAST UPDATED' },
];

/* ── Section wrapper ────────────────────────────────────────────────── */
const Section: React.FC<{ id: string; title: string; sub: string; children: React.ReactNode }> = ({ id, title, sub, children }) => (
  <section id={id} className="ds-section">
    <div className="ds-section__head">
      <h2 className="ds-section__title">{title}</h2>
      <p className="ds-section__sub">{sub}</p>
    </div>
    {children}
  </section>
);

/* ── Main page ──────────────────────────────────────────────────────── */
export const DesignSystem: React.FC = () => (
  <PageWrapper className="ds-page">
    {/* Header */}
    <div className="ds-header">
      <div className="ds-header__left">
        <span className="ds-header__eyebrow"><HiSparkles /> Design System · v1.0</span>
        <h1 className="ds-header__title">CookIT Visual Language</h1>
        <p className="ds-header__desc">Tokens, components, and patterns used across the CookIT application.</p>
      </div>
      <div className="ds-header__actions">
        <a href="/mockups.html" target="_blank" rel="noopener noreferrer" className="ds-download-btn" style={{ marginRight: 8 }}>
          <FiSearch /> UI Mockups
        </a>
        <a href="/design-system.html" download className="ds-download-btn">
          <FiDownload /> Download PDF
        </a>
      </div>
    </div>

    {/* Nav + Content */}
    <div className="ds-layout">
      <nav className="ds-nav" aria-label="Design system sections">
        {[
          ['#colors',      '🎨 Colors'],
          ['#typography',  '🔤 Typography'],
          ['#buttons',     '🔘 Buttons & Inputs'],
          ['#recipe-card', '🃏 Recipe Cards'],
          ['#chat',        '💬 Chat Components'],
        ].map(([href, label]) => (
          <a key={href} href={href} className="ds-nav__link">{label}</a>
        ))}
      </nav>

      <main className="ds-content">

        {/* ── 1. Colors ─────────────────────────────────────────── */}
        <Section id="colors" title="Color Palette" sub="Brand colors, warm neutrals, and semantic states.">
          <div className="ds-block">
            <h3 className="ds-block__label">Brand</h3>
            <div className="ds-swatches">
              {BRAND_COLORS.map((c) => (
                <div key={c.name} className="ds-swatch">
                  <div className="ds-swatch__chip" style={{ background: c.hex }} />
                  <span className="ds-swatch__name">{c.name}</span>
                  <span className="ds-swatch__hex">{c.hex}</span>
                  <span className="ds-swatch__token">{c.token}</span>
                  <span className="ds-swatch__desc">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ds-block">
            <h3 className="ds-block__label">Warm Neutrals</h3>
            <div className="ds-neutral-row">
              {NEUTRAL_COLORS.map((c) => (
                <div key={c.name} className="ds-neutral-chip">
                  <div className="ds-neutral-chip__color" style={{ background: c.hex }} />
                  <span className="ds-neutral-chip__label">{c.name}</span>
                  <span className="ds-neutral-chip__hex">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ds-block">
            <h3 className="ds-block__label">Semantic</h3>
            <div className="ds-swatches ds-swatches--row">
              {SEMANTIC_COLORS.map((c) => (
                <div key={c.name} className="ds-swatch ds-swatch--sm">
                  <div className="ds-swatch__chip" style={{ background: c.hex }} />
                  <span className="ds-swatch__name">{c.name}</span>
                  <span className="ds-swatch__hex">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 2. Typography ─────────────────────────────────────── */}
        <Section id="typography" title="Typography" sub="Playfair Display for headings, Inter for body text.">
          <div className="ds-block">
            <div className="ds-font-row">
              <div className="ds-font-card">
                <span className="ds-font-card__name">Playfair Display</span>
                <span className="ds-font-card__use">Headings · H1–H4</span>
                <span className="ds-font-card__sample" style={{ fontFamily: 'var(--font-heading)', fontSize: 28 }}>Aa Bb Cc</span>
              </div>
              <div className="ds-font-card">
                <span className="ds-font-card__name">Inter</span>
                <span className="ds-font-card__use">Body · Labels · UI</span>
                <span className="ds-font-card__sample" style={{ fontFamily: 'var(--font-body)', fontSize: 28 }}>Aa Bb Cc</span>
              </div>
            </div>
          </div>

          <div className="ds-block">
            <h3 className="ds-block__label">Type Scale</h3>
            <div className="ds-type-scale">
              {TYPE_SCALE.map((t) => (
                <div key={t.label} className="ds-type-row">
                  <div className="ds-type-row__meta">
                    <span className="ds-type-row__label">{t.label}</span>
                    <span className="ds-type-row__spec">{t.size} · {t.weight} · {t.family}</span>
                  </div>
                  <p
                    className="ds-type-row__sample"
                    style={{
                      fontSize: t.size,
                      fontWeight: t.weight,
                      fontFamily: t.family === 'Playfair Display' ? 'var(--font-heading)' : 'var(--font-body)',
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 3. Buttons & Inputs ───────────────────────────────── */}
        <Section id="buttons" title="Buttons & Inputs" sub="Interactive controls used across the application.">
          <div className="ds-block">
            <h3 className="ds-block__label">Button Variants</h3>
            <div className="ds-row">
              <Button variant="primary" icon={<FiZap />}>Primary</Button>
              <Button variant="secondary" icon={<MdOutlineAutoAwesome />}>Secondary</Button>
              <Button variant="ghost" icon={<FiHeart />}>Ghost</Button>
              <Button variant="primary" icon={<HiSparkles />}>AI Action</Button>
            </div>
          </div>

          <div className="ds-block">
            <h3 className="ds-block__label">Button Sizes</h3>
            <div className="ds-row ds-row--align-end">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" isLoading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="ds-block">
            <h3 className="ds-block__label">Input Fields</h3>
            <div className="ds-inputs-grid">
              <Input placeholder="Default input" />
              <Input isSearch placeholder="Search recipes…" />
              <Input icon={<FiMail />} placeholder="With icon" />
              <Input placeholder="Error state" error="This field is required" />
            </div>
          </div>

          <div className="ds-block">
            <h3 className="ds-block__label">Badges</h3>
            <div className="ds-row ds-row--wrap">
              <Badge variant="time" icon={<FiClock />}>20m</Badge>
              <Badge variant="calorie" icon={<FiActivity />}>420 kcal</Badge>
              <Badge variant="easy">Easy</Badge>
              <Badge variant="medium">Medium</Badge>
              <Badge variant="hard">Hard</Badge>
              <Badge variant="diet" icon={<FiUsers />}>High Protein</Badge>
              <Badge variant="diet">Gluten-Free</Badge>
            </div>
          </div>
        </Section>

        {/* ── 4. Recipe Cards ───────────────────────────────────── */}
        <Section id="recipe-card" title="Recipe Cards" sub="Card component displaying recipe summary, metadata, and AI match score.">
          <div className="ds-block">
            <h3 className="ds-block__label">Recipe Card</h3>
            <div className="ds-card-preview">
              <RecipeCard recipe={MOCK_RECIPE} />
            </div>
          </div>
          <div className="ds-block">
            <h3 className="ds-block__label">Card Anatomy</h3>
            <div className="ds-anatomy">
              {[
                ['Top Bar',      'Cuisine emoji, cuisine tag, AI match score badge, favourite button'],
                ['Match Reasons','Short AI-generated tags explaining why recipe matches (e.g. "High Protein")'],
                ['Title',        'H3 — Playfair Display Bold — recipe name'],
                ['Description',  'Body SM — up to 2 lines, clipped with ellipsis'],
                ['Badges Row',   'Cook time, calories, difficulty, servings using Badge component'],
                ['AI Tip',       'Highlighted tip line with HiSparkles icon — shown when aiTip is present'],
              ].map(([part, desc]) => (
                <div key={part} className="ds-anatomy__row">
                  <span className="ds-anatomy__part">{part}</span>
                  <span className="ds-anatomy__desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 5. Chat Components ────────────────────────────────── */}
        <Section id="chat" title="Chat Components" sub="Conversational UI for the AI cooking assistant.">
          <div className="ds-block">
            <h3 className="ds-block__label">Chat Bubbles</h3>
            <div className="ds-chat-preview">
              {MOCK_MESSAGES.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              <TypingIndicator />
            </div>
          </div>
          <div className="ds-block">
            <h3 className="ds-block__label">Component Anatomy</h3>
            <div className="ds-anatomy">
              {[
                ['User Bubble',      'Right-aligned, Primary gradient background, white text, timestamp below'],
                ['Assistant Bubble', 'Left-aligned, Chef hat avatar, warm-100 background, supports Markdown rendering'],
                ['Typing Indicator', 'Three bouncing dots shown while AI streams a response'],
                ['Suggested Prompts','Chip row shown on empty chat — tappable shortcut messages'],
                ['Chat Input',       'Auto-resize textarea with send button, voice hint, and character hint'],
              ].map(([part, desc]) => (
                <div key={part} className="ds-anatomy__row">
                  <span className="ds-anatomy__part">{part}</span>
                  <span className="ds-anatomy__desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

      </main>
    </div>
  </PageWrapper>
);

export default DesignSystem;
