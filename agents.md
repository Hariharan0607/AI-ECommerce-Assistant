\# AI E-Commerce Assistant - Agents



\## 1. Order Agent



\### Responsibility

Handles e-commerce order processing and tracking.



\### Inputs

\- Order ID

\- Customer information

\- Product information

\- Order amount

\- Order status



\### Outputs

\- Processed order information

\- Order status

\- Processing confirmation



\---



\## 2. Fraud Detection Agent



\### Responsibility

Detects potentially suspicious e-commerce orders.



\### Inputs

\- Order amount

\- Order status

\- Customer information



\### Outputs

\- Fraud risk score

\- Risk level

\- Reasons for the risk classification



\### Risk Levels

\- Low

\- Medium

\- High



\---



\## 3. Customer Analysis Agent



\### Responsibility

Analyzes customer purchasing behavior.



\### Inputs

\- Customer ID

\- Customer name

\- Total orders

\- Total spending



\### Outputs

\- Customer segment

\- Customer spending analysis

\- Personalized recommendation



\---



\## 4. Analysis Agent



\### Responsibility

Analyzes overall business performance.



\### Inputs

\- Order records



\### Outputs

\- Total revenue

\- Total orders

\- Average order value

\- Delivered orders

\- Pending orders

\- Business summary



\---



\## 5. Report Agent



\### Responsibility

Generates business reports from the analysis results.



\### Inputs

\- Revenue information

\- Order information

\- Business analysis



\### Outputs

\- Business report

\- Summary

\- Recommendations



\---



\## 6. Orchestrator Agent



\### Responsibility

Coordinates the complete multi-agent workflow.



\### Workflow



```text

User Request

&#x20;    |

&#x20;    v

Orchestrator Agent

&#x20;    |

&#x20;    +----> Order Agent

&#x20;    |

&#x20;    +----> Fraud Detection Agent

&#x20;    |

&#x20;    +----> Customer Analysis Agent

&#x20;    |

&#x20;    +----> Analysis Agent

&#x20;    |

&#x20;    +----> Report Agent

&#x20;    |

&#x20;    v

Unified AI Result

