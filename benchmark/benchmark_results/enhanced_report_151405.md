# 🚀 Unghost Outreach Benchmark Report

**Generated:** 2025-07-18 18:21:40
**Backend URL:** http://localhost:8000
**Total Duration:** 54.1 seconds

## 📊 Executive Summary

- **Scenarios Tested:** 10
- **Successful Generations:** 3 (30.0%)
- **Successful Evaluations:** 3 (30.0%)
- **Overall Average Score:** 4.29/5.0 (Good)

## 📈 Quick Stats Dashboard

| Metric | Value | Status |
|--------|-------|--------|
| Success Rate | 30.0% | ❌ |
| Avg Generation Time | 10.15s | ⏱️ |
| Overall Quality Score | 4.29/5.0 | 👍 |

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
| Tone Appropriateness | 4.67/5.0 | █████████░ | 15% | 0.70 |
| Clarity Readability | 5.00/5.0 | ██████████ | 10% | 0.50 |
| Cta Effectiveness | 4.00/5.0 | ████████░░ | 15% | 0.60 |
| Authenticity | 3.67/5.0 | ███████░░░ | 15% | 0.55 |
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

> Congratulations on Enterprise Solutions Inc.'s recent Series B funding! That's a significant achievement, and I imagine you're focused on scaling your technology infrastructure to meet the growing demands.

> As a fellow B2B SaaS founder with a focus on enterprise security, I understand the unique challenges that come with rapid growth. I've helped several companies proactively address security vulnerabilities and minimize incidents during critical expansion phases.

> I'd be happy to share some insights on how to ensure your security posture keeps pace with your growth. Would you be open to a brief call next week?

> Best regards,

> \[Sender Name]
```

📏 **Message Stats:** 105 words, 672 characters
⏱️ **Generation Time:** 10.21 seconds

#### 📊 Evaluation Results

**Overall Score:** 4.43/5.0 ████████░░ (Good)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Personalization | 4/5 | The message acknowledges the Series B funding and connects it to the recipient's likely focus on ... |
| Goal Alignment | 4/5 | The message's objective is to schedule a demo and it directly addresses that with a clear call to... |
| Tone Appropriateness | 5/5 | The tone is professional, respectful, and suitable for a CTO. The language is straightforward and... |
| Clarity Readability | 5/5 | The message is concise, well-structured, and easy to understand. The paragraphs are short and foc... |
| Cta Effectiveness | 4/5 | The CTA is clear and direct, asking for a brief call. It could be improved by specifying the demo... |
| Authenticity | 4/5 | The message feels genuine and avoids a generic template. The mention of being a fellow B2B SaaS f... |
| Relevance | 5/5 | The message is highly relevant, referencing the Series B funding (recent activity), the challenge... |

**Expected Elements Check:**
- ✅ Present: 4/6
  - ✅ Congratulations On Series B Funding
  - ✅ Reference To Scaling Challenges
  - ❌ Specific Security Concerns During Growth
  - ✅ Credibility With Similar Companies
  - ❌ Clear Cta For 20-Minute Demo
  - ✅ Professional Executive Tone

**💪 Strengths:**
- Strong personalization based on recent funding and role.
- Excellent tone and clarity.
- Clear and relevant value proposition.

**🔧 Areas for Improvement:**
- Specify the demo length in the CTA.
- Include more specific security concerns that are relevant during rapid scaling (e.g., misconfigurations, lack of visibility).
- Consider mentioning specific technologies used by Enterprise Solutions Inc., if this information is publicly available, to further personalize the message.

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
> I noticed your engagement with the recent posts on AI and product management – great insights! As a fellow founder in the AI space, I'm always keen to connect with others exploring these areas.
>
> I've been building B2B SaaS products for the past 5 years, and I'm particularly interested in how AI can enhance user experience. I'd be happy to share some thoughts on potential AI applications within TechCorp's product line, if that's of interest.
>
> No pressure at all, but I'd love to connect and chat if you're open to it.
>
> Best,
> Alex
>
>
```

📏 **Message Stats:** 106 words, 561 characters
⏱️ **Generation Time:** 10.63 seconds

#### 📊 Evaluation Results

**Overall Score:** 4.57/5.0 █████████░ (Excellent)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Personalization | 4/5 | The message references Sarah's engagement with recent posts on AI and product management, demonst... |
| Goal Alignment | 5/5 | The message explicitly states the desire to connect and discuss potential AI applications within ... |
| Tone Appropriateness | 5/5 | The tone is professional yet friendly, suitable for a LinkedIn DM. Phrases like 'great insights' ... |
| Clarity Readability | 5/5 | The message is concise, using clear language. The paragraphs are short and easy to follow. |
| Cta Effectiveness | 4/5 | The call to action ('I'd love to connect and chat if you're open to it') is soft and appropriate ... |
| Authenticity | 4/5 | The message feels genuine. It uses conversational language like 'I'm always keen to connect' and ... |
| Relevance | 5/5 | The message directly references Sarah's interest in AI and product management, and aligns with he... |

**Expected Elements Check:**
- ✅ Present: 5/6
  - ✅ Reference To Ai Trends Post
  - ❌ Mention Of Human-Centric Design Alignment
  - ✅ Soft Cta For Coffee Chat Or Virtual Meeting
  - ✅ Professional But Friendly Tone
  - ✅ Specific Value Proposition
  - ✅ Mutual Interest In Ai Product Management

**💪 Strengths:**
- Strong personalization by referencing Sarah's recent posts.
- Clear and concise messaging.
- Appropriate professional and friendly tone.

**🔧 Areas for Improvement:**
- Could more explicitly mention human-centric design in relation to AI.
- The CTA could be slightly more specific (e.g., 'Would you be open to a 15-minute virtual coffee chat?').

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
Hey Alex, circling back on my previous message. I noticed your comment on \[Specific Tweet]. I think our tool could be a good fit for \[specific use case]. Any chance you'd be open to a quick look?"
```

📏 **Message Stats:** 37 words, 198 characters
⏱️ **Generation Time:** 9.60 seconds

#### 📊 Evaluation Results

**Overall Score:** 3.86/5.0 ███████░░░ (Average)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Personalization | 3/5 | The message references a previous message and mentions a tweet, which is good, but it's missing a... |
| Goal Alignment | 4/5 | The message directly addresses the objective of getting feedback on the product. It hints at a po... |
| Tone Appropriateness | 4/5 | The tone is friendly and conversational, suitable for a Twitter DM. The language 'circling back' ... |
| Clarity Readability | 5/5 | The message is short, direct, and easy to understand. The language is straightforward. |
| Cta Effectiveness | 4/5 | The CTA is clear and actionable: 'Any chance you'd be open to a quick look?' It's non-committal, ... |
| Authenticity | 3/5 | The message feels somewhat generic because of the lack of specifics about the tweet. It could be ... |
| Relevance | 4/5 | The message references the recipient's recent activity (the tweet) and connects it to the sender'... |

**Expected Elements Check:**
- ✅ Present: 4/6
  - ✅ Reference To Funding Trends Tweet
  - ✅ Mention Product-Market Fit Connection
  - ✅ Friendly Conversational Tone
  - ✅ Low-Pressure Invitation To Try Product
  - ❌ Offer To Provide Exclusive Insights Or Demo
  - ❌ Authentic Enthusiasm Without Being Salesy

**💪 Strengths:**
- Clear and concise language.
- Good alignment with the objective.
- Appropriate tone for a Twitter DM.

**🔧 Areas for Improvement:**
- Add a specific reference to the content of Alex's tweet.
- Add a specific use case related to the tool and the recipient's interests.
- Consider a slightly more compelling hook to encourage engagement.

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
1. **LinkedIn DM** (linkedin_dm_001): 4.57/5.0
1. **Cold Email** (cold_email_003): 4.43/5.0
1. **Twitter DM** (twitter_dm_002): 3.86/5.0

## 💡 Recommendations

- 🚨 **Critical**: Low success rate indicates system instability. Prioritize debugging failed generations.
- 🌟 **Maintain Excellence In:**
  - Tone Appropriateness (4.67/5.0)
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
