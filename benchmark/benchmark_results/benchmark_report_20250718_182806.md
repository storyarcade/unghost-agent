# 🚀 Unghost Outreach Benchmark Report

**Generated:** 2025-07-18 18:28:06
**Backend URL:** http://localhost:8000
**Total Duration:** 52.9 seconds

## 📊 Executive Summary

- **Scenarios Tested:** 10
- **Successful Generations:** 3 (30.0%)
- **Successful Evaluations:** 3 (30.0%)
- **Overall Average Score:** 4.26/5.0 (Good)

## 📈 Quick Stats Dashboard

| Metric | Value | Status |
|--------|-------|--------|
| Success Rate | 30.0% | ❌ |
| Avg Generation Time | 9.87s | 🚀 |
| Overall Quality Score | 4.26/5.0 | 👍 |

## 🔧 API Request Configuration

```json
{
  "endpoint": "/api/chat/stream",
  "method": "POST",
  "timeout": 120,
  "payload_template": {
    "messages": [{"role": "user", "content": "<personalized_prompt>"}],
    "user_background": "<sender_background>",
    "enable_background_investigation": true,
    "max_plan_iterations": 1,
    "max_step_num": 3,
    "max_search_results": 3,
    "auto_accepted_plan": true,
    "report_style": "friendly"
  }
}
```

## 📊 Evaluation Criteria Analysis

| Criterion | Score | Visual | Weight | Impact |
|-----------|-------|--------|--------|--------|
| Personalization | 3.67/5.0 | ███████░░░ | 20% | 0.73 |
| Goal Alignment | 4.33/5.0 | ████████░░ | 15% | 0.65 |
| Tone Appropriateness | 5.00/5.0 | ██████████ | 15% | 0.75 |
| Clarity Readability | 5.00/5.0 | ██████████ | 10% | 0.50 |
| Cta Effectiveness | 4.00/5.0 | ████████░░ | 15% | 0.60 |
| Authenticity | 4.00/5.0 | ████████░░ | 15% | 0.60 |
| Relevance | 4.67/5.0 | █████████░ | 10% | 0.47 |

## 🔍 Detailed Test Results

### Test #1: Cold Email (cold_email_003)

#### 📋 Test Context

**Target Recipient:**
- **Name:** Michael Johnson
- **Role:** CTO at Enterprise Solutions Inc
- **Recent Activity:** Company just raised Series B funding of $50M to scale their infrastructure
- **Interests:** Cloud Architecture, DevOps, Security, Team Scaling

**Sender Profile:**
- **Objective:** Schedule a demo of our enterprise security platform
- **Value Proposition:** Helped 5 unicorns reduce security incidents by 70% during rapid scaling

#### 📤 Request Details

<details>
<summary>Click to expand request prompt</summary>

```
Create a Cold Email outreach message with the following context:

RECIPIENT INFORMATION:
- Name: Michael Johnson
- Role: CTO at Enterprise Solutions Inc
- Recent Activity: Company just raised Series B funding of $50M to scale their infrastructure
- Interests: Cloud Architecture, DevOps, Security, Team Scaling
- Profile: Former Google engineer, now leading 200+ person engineering team

SENDER INFORMATION:
- Name: Emma Williams
- Background: B2B SaaS founder with enterprise security focus
- Company: SecureScale
- Objective: Schedule a demo of our enterprise security platform
- Value Proposition: Helped 5 unicorns reduce security incidents by 70% during rapid scaling

Please create a personalized outreach message that:
1. References the recipient's recent activity
2. Establishes common ground or mutual interests
3. Clearly communicates the value proposition
4. Includes a specific but low-pressure call-to-action
5. Maintains an authentic, human tone appropriate for Cold Email

Generate ONLY the message content, without any preamble or explanation.
```

</details>

#### 📥 Generated Response

**Final Outreach Message:**
```
Hi Michael,
>
> Congratulations on Enterprise Solutions Inc.'s recent Series B funding! That's a fantastic achievement, and I've been following your company's growth with great interest, especially your focus on cloud architecture, DevOps, and team scaling.
>
> Given your focus on these areas, I thought you might find value in exploring how our B2B SaaS solution can enhance your security posture and operational efficiency. We specialize in helping organizations like yours protect their cloud environments and streamline security operations.
>
> Would you be open to a brief conversation to discuss how we could potentially support your team's objectives?
>
> Best regards,
>
> \[Sender Name]
```

📏 **Message Stats:** 109 words, 696 characters
⏱️ **Generation Time:** 9.60 seconds

#### 📊 Evaluation Results

**Overall Score:** 4.43/5.0 ████████░░ (Good)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Personalization | 4/5 | The message references Michael's role (CTO) and his company's Series B funding. It also mentions ... |
| Goal Alignment | 4/5 | The message clearly states the sender's intention to discuss how their solution can help Enterpri... |
| Tone Appropriateness | 5/5 | The tone is professional, respectful, and suitable for a cold email to a CTO. It's not overly sal... |
| Clarity Readability | 5/5 | The message is concise, uses straightforward language, and is easy to understand. The paragraphs ... |
| Cta Effectiveness | 4/5 | The CTA is clear and asks for a brief conversation. However, it could be slightly more specific (... |
| Authenticity | 4/5 | The message feels genuine, with a personal touch. It avoids overly generic phrasing, but it could... |
| Relevance | 5/5 | The message directly addresses the recipient's recent activity (Series B funding) and their state... |

**Expected Elements Check:**
- ✅ Present: 3/6
  - ✅ Congratulations On Series B Funding
  - ✅ Reference To Scaling Challenges
  - ❌ Specific Security Concerns During Growth
  - ❌ Credibility With Similar Companies
  - ❌ Clear Cta For 20-Minute Demo
  - ✅ Professional Executive Tone

**💪 Strengths:**
- Strong personalization
- Professional tone
- Clear and concise language

**🔧 Areas for Improvement:**
- Include specific security concerns during growth or a concrete example.
- Provide a clear CTA for a 20-minute demo.
- Add a sentence about credibility with similar companies (e.g., helped X companies like yours...).

#### 🤔 Agent's Thought Process

<details>
<summary>Click to see agent's planning and reasoning</summary>

```
(Unable to parse agent thought process)
```
</details>

---

### Test #2: LinkedIn DM (linkedin_dm_001)

#### 📋 Test Context

**Target Recipient:**
- **Name:** Sarah Chen
- **Role:** Product Manager at TechCorp
- **Recent Activity:** Posted about AI trends in product management and the importance of human-centric design
- **Interests:** AI/ML, Product Strategy, Team Leadership, Design Thinking

**Sender Profile:**
- **Objective:** Connect and discuss potential collaboration on AI product strategy
- **Value Proposition:** Successfully implemented AI in 3 enterprise products with 40% efficiency gains

#### 📤 Request Details

<details>
<summary>Click to expand request prompt</summary>

```
Create a LinkedIn DM outreach message with the following context:

RECIPIENT INFORMATION:
- Name: Sarah Chen
- Role: Product Manager at TechCorp
- Recent Activity: Posted about AI trends in product management and the importance of human-centric design
- Interests: AI/ML, Product Strategy, Team Leadership, Design Thinking
- Profile: 10+ years in product management, focused on AI-powered B2B solutions

SENDER INFORMATION:
- Name: Alex Thompson
- Background: AI startup founder with 5 years experience building B2B SaaS products
- Company: InnovateAI
- Objective: Connect and discuss potential collaboration on AI product strategy
- Value Proposition: Successfully implemented AI in 3 enterprise products with 40% efficiency gains

Please create a personalized outreach message that:
1. References the recipient's recent activity
2. Establishes common ground or mutual interests
3. Clearly communicates the value proposition
4. Includes a specific but low-pressure call-to-action
5. Maintains an authentic, human tone appropriate for LinkedIn DM

Generate ONLY the message content, without any preamble or explanation.
```

</details>

#### 📥 Generated Response

**Final Outreach Message:**
```
Hi Sarah,
>
> I noticed your recent engagement with the post on \[Specific AI Topic]. As an AI startup founder, I'm always keen to connect with product leaders exploring similar areas.
>
> I've been working on \[brief, relevant project/product] and have found \[brief insight/result]. I'd be interested in hearing your perspective on how you're approaching AI product strategy at \[Her Company].
>
> Would you be open to a quick chat sometime next week to exchange ideas?
>
> Best,
> \[Sender Name]
```

📏 **Message Stats:** 85 words, 498 characters
⏱️ **Generation Time:** 9.89 seconds

#### 📊 Evaluation Results

**Overall Score:** 4.50/5.0 █████████░ (Excellent)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Personalization | 4/5 | The message references the recipient's recent engagement with a post on a specific AI topic, demo... |
| Goal Alignment | 5/5 | The message's objective is clearly stated: to connect and discuss potential collaboration on AI p... |
| Tone Appropriateness | 5/5 | The tone is professional and friendly, suitable for a LinkedIn DM. It's respectful and invites a ... |
| Clarity Readability | 5/5 | The message is clear, concise, and easy to understand. The language is straightforward and avoids... |
| Cta Effectiveness | 4/5 | The call to action is clear and actionable: a quick chat. It's also soft, which is appropriate fo... |
| Authenticity | 4/5 | The message feels genuine and human-like. It doesn't read like a generic template, especially wit... |
| Relevance | 5/5 | The message directly references the recipient's recent activity (AI post). It also focuses on mut... |

**Expected Elements Check:**
- ✅ Present: 4/6
  - ✅ Reference To Ai Trends Post
  - ❌ Mention Of Human-Centric Design Alignment
  - ✅ Soft Cta For Coffee Chat Or Virtual Meeting
  - ✅ Professional But Friendly Tone
  - ❌ Specific Value Proposition
  - ✅ Mutual Interest In Ai Product Management

**💪 Strengths:**
- Strong personalization by referencing the recipient's post.
- Clear goal alignment and relevant to the recipient's interests.
- Professional and friendly tone.

**🔧 Areas for Improvement:**
- Include a specific value proposition (e.g., mentioning the 40% efficiency gains if relevant).
- Mention human-centric design to align with the recipient's interests.
- Specify the AI topic in the reference to the post (e.g., "your post on NLP...").

#### 🤔 Agent's Thought Process

<details>
<summary>Click to see agent's planning and reasoning</summary>

```
(Unable to parse agent thought process)
```
</details>

---

### Test #3: Twitter DM (twitter_dm_002)

#### 📋 Test Context

**Target Recipient:**
- **Name:** Alex Rodriguez
- **Role:** Tech Influencer at Independent
- **Recent Activity:** Tweeted about startup funding trends and the importance of product-market fit
- **Interests:** Startups, Product Development, Venture Capital, Tech Trends

**Sender Profile:**
- **Objective:** Get feedback on our product and potentially feature in their content
- **Value Proposition:** Building a tool that helps startups validate product-market fit 3x faster

#### 📤 Request Details

<details>
<summary>Click to expand request prompt</summary>

```
Create a Twitter DM outreach message with the following context:

RECIPIENT INFORMATION:
- Name: Alex Rodriguez
- Role: Tech Influencer at Independent
- Recent Activity: Tweeted about startup funding trends and the importance of product-market fit
- Interests: Startups, Product Development, Venture Capital, Tech Trends
- Profile: 50K followers, writes about startup ecosystem and product innovation

SENDER INFORMATION:
- Name: Jordan Lee
- Background: Early-stage startup founder seeking product feedback
- Company: ProductFlow
- Objective: Get feedback on our product and potentially feature in their content
- Value Proposition: Building a tool that helps startups validate product-market fit 3x faster

Please create a personalized outreach message that:
1. References the recipient's recent activity
2. Establishes common ground or mutual interests
3. Clearly communicates the value proposition
4. Includes a specific but low-pressure call-to-action
5. Maintains an authentic, human tone appropriate for Twitter DM

Generate ONLY the message content, without any preamble or explanation.
```

</details>

#### 📥 Generated Response

**Final Outreach Message:**
```
Hey Alex,

> Huge fan of your work, especially [mention a specific recent activity, e.g., your recent investment in X or your content on Y].

> I'm Jordan, founder of [Product Name], and we're building [briefly describe your product and its value proposition, e.g., a platform to help entrepreneurs connect with investors]. I was hoping to get your thoughts on it.

> Would you be open to taking a quick look and sharing some feedback? Even a few minutes would be incredibly valuable.

> Thanks so much for your time!

> Best,
> Jordan
```

📏 **Message Stats:** 94 words, 535 characters
⏱️ **Generation Time:** 10.14 seconds

#### 📊 Evaluation Results

**Overall Score:** 3.86/5.0 ███████░░░ (Average)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Personalization | 3/5 | The message references the recipient's work generally, but lacks specific detail from the *recent... |
| Goal Alignment | 4/5 | The message's objective is to get feedback and potentially feature the product. This is clearly s... |
| Tone Appropriateness | 5/5 | The tone is friendly, conversational, and non-salesy, appropriate for a Twitter DM. The language ... |
| Clarity Readability | 5/5 | The message is concise, uses clear language, and is easy to understand. The product and its value... |
| Cta Effectiveness | 4/5 | The call to action (CTA) is clear and actionable: "Would you be open to taking a quick look and s... |
| Authenticity | 4/5 | The message avoids overly generic phrases and sounds like a genuine outreach attempt. It's person... |
| Relevance | 4/5 | The message mentions the recipient's general 'work', but it would be more relevant if it directly... |

**Expected Elements Check:**
- ✅ Present: 4/6
  - ❌ Reference To Funding Trends Tweet
  - ✅ Mention Product-Market Fit Connection
  - ✅ Friendly Conversational Tone
  - ✅ Low-Pressure Invitation To Try Product
  - ❌ Offer To Provide Exclusive Insights Or Demo
  - ✅ Authentic Enthusiasm Without Being Salesy

**💪 Strengths:**
- Friendly and conversational tone
- Clear and concise language
- Clear and actionable call to action

**🔧 Areas for Improvement:**
- Incorporate a direct reference to the recipient's recent tweet about funding trends or product-market fit.
- Consider adding a small incentive, such as offering exclusive insights or a product demo.

#### 🤔 Agent's Thought Process

<details>
<summary>Click to see agent's planning and reasoning</summary>

```
(Unable to parse agent thought process)
```
</details>

---

## 📊 Comparative Analysis

**🏆 Top Performers:**
1. **LinkedIn DM** (linkedin_dm_001): 4.50/5.0
1. **Cold Email** (cold_email_003): 4.43/5.0
1. **Twitter DM** (twitter_dm_002): 3.86/5.0

## 💡 Recommendations

- 🚨 **Critical**: Low success rate indicates system instability. Prioritize debugging failed generations.
- 🌟 **Maintain Excellence In:**
  - Tone Appropriateness (5.00/5.0)
  - Clarity Readability (5.00/5.0)
  - Relevance (4.67/5.0)
- 🎯 **Scale Testing**: Expand to more diverse scenarios and edge cases
- 📊 **Track Metrics**: Monitor real-world response rates to validate benchmark scores
## 🔧 Technical Details

**Benchmark Configuration:**
- LLM Judge: Gemini 2.0 Flash (Experimental)
- Evaluation Criteria: 7 weighted factors
- Timeout: 120 seconds per generation
- Rate Limiting: 2 seconds between requests
