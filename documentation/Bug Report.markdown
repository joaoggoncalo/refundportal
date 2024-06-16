**Bug Tracking Document**

**Overview**

This document serves as a basis for tracking and managing bugs
encountered during the course of our software engineering project. All
team members are expected to report and document any bugs they encounter
for centralized resolution and tracking.

The purpose of this document is to:

-   Encourage a standard method for bug reporting.

-   Ensure that bugs are resolved in an organized manner.

-   Promote transparency and coordination among team members.

-   Improve the quality and reliability of our software.

**Bug Reporting Process**

**1. Identification**

Upon encountering an issue, team members should first verify whether
it\'s a real bug or just a misunderstanding of the system functionality.

**2. Bug Submission**

Once a bug is identified, team members should create a new bug report in
the bug tracking system. This report should include:

-   Bug ID: Unique identifier for the bug.

-   Reporter: The name of the individual who found the bug.

-   Date of Reporting: When the bug was reported.

-   Bug Description: Detailed description of the bug and its impact on
    the software\'s functionality.

-   Expected Result: What the system should do if it was functioning
    correctly.

-   Actual Result: What the system actually does.

-   Screenshots/Video: Visual evidence of the bug (if applicable).

**3. Bug Triage**

**Bug Life Cycle**

The lifecycle of a bug includes:

-   New

-   In Progress

-   Testing

-   Verified

-   Closed

The \'Verified\' status is used when the fix is tested and confirmed by
the team. \'Closed\' status means the bug is fixed, tested, and approved
by the project manager or client.

**Resolution and Verification**

Once a bug is fixed, the person who reported the bug needs to be
notified to verify that the solution works as expected. If the fix is
confirmed, the bug\'s status will be updated to \'Closed\'. If not, the
bug returns to \'In Progress\' status.

This document will be updated regularly to track the status of all
identified bugs throughout the course of the project.

Note: All project team members are required to follow this bug tracking
process to ensure an organized and efficient resolution of software
issues. It\'s important to maintain good communication to ensure all
bugs are tracked and addressed promptly.

**Bug Report**

**Bug Details**

-   Bug ID: 001

-   Reporter: João Duarte

-   Date of Reporting: 19/12/2023

-   Bug Description: When multiple RMA details sections are expanded,
    they all display the same return items because it is displaying the
    last fetche items in every single RMA details.

-   Expected Result: Each expanded RMA detail section should display its
    own set of return items relevant to that specific RMA.

-   Actual Result: All expanded RMA detail sections display the return
    items of the most recently clicked RMA, rather than showing their
    respective item.

-   Image (optional):

![](image1.png)
**Bug Status**

-   Current Status: Closed

-   Date Fixed: 19/12/2023

-   Fixed by: João Duarte

-   Resolution Summary: The bug was solved by modifying the the previous
    rmaData and store the items there instead of just using the sharing
    method returnItems which was causing the problem.

**Bug Details**

-   Bug ID: 002

-   Reporter: João Duarte

-   Date of Reporting: 16/01/2024

-   Bug Description: The status of the product was being overwritten

-   Expected Result: Having 2 types of status so one doesn't overwrite
    the other because there are 2 different types of status in a product

-   Actual Result: There's only one status and that one is being
    overwritten in the process

**Bug Status**

-   Current Status: Closed

-   Date Fixed: 22/01/2024

-   Fixed by: João Duarte

-   Resolution Summary: A new table was created to change the status of
    the process and the old status name was changed to make a
    differentiation between both.
