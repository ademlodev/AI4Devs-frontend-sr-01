import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Companies
  const company1 = await prisma.company.create({
    data: {
      name: 'LTI',
    },
  });

  // Create Interview Flows
  const interviewFlow1 = await prisma.interviewFlow.create({
    data: {
      description: 'Standard development interview process',
    },
  });

  const interviewFlow2 = await prisma.interviewFlow.create({
    data: {
      description: 'Data science interview process',
    },
  });

  // Create Positions (aligned with frontend mock data)
  const position1 = await prisma.position.create({
    data: {
      title: 'Senior Backend Engineer',
      description: 'Develop and maintain backend systems and APIs.',
      status: 'Open',
      isVisible: true,
      location: 'Remote',
      jobDescription: 'Backend development with focus on scalable APIs',
      companyId: company1.id,
      interviewFlowId: interviewFlow1.id,
      salaryMin: 70000,
      salaryMax: 100000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off',
      contactInfo: 'john.doe@lti.com',
      requirements: '5+ years of experience in backend development, knowledge in Node.js and databases',
      responsibilities: 'Design and develop scalable backend systems.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-12-31')
    },
  });

  const position2 = await prisma.position.create({
    data: {
      title: 'Junior Android Engineer',
      description: 'Develop mobile applications for Android platform.',
      status: 'Open',
      isVisible: true,
      location: 'Hybrid',
      jobDescription: 'Android mobile development',
      companyId: company1.id,
      interviewFlowId: interviewFlow1.id,
      salaryMin: 45000,
      salaryMax: 65000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off',
      contactInfo: 'jane.smith@lti.com',
      requirements: '1-3 years of Android development experience, knowledge in Kotlin and Java',
      responsibilities: 'Develop and maintain Android mobile applications.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-11-15')
    },
  });

  const position3 = await prisma.position.create({
    data: {
      title: 'Product Manager',
      description: 'Lead product strategy and development.',
      status: 'Draft',
      isVisible: true,
      location: 'On-site',
      jobDescription: 'Product management and strategy',
      companyId: company1.id,
      interviewFlowId: interviewFlow1.id,
      salaryMin: 80000,
      salaryMax: 120000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off, Stock options',
      contactInfo: 'alex.jones@lti.com',
      requirements: '3+ years of product management experience, MBA preferred',
      responsibilities: 'Define product roadmap and coordinate with development teams.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-07-31')
    },
  });

  // Create Candidates
  const candidate1 = await prisma.candidate.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
      address: '123 Main St',
      educations: {
        create: [
          {
            institution: 'University A',
            title: 'BSc Computer Science',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-06-01'),
          },
        ],
      },
      workExperiences: {
        create: [
          {
            company: 'Eventbrite',
            position: 'Software Developer',
            description: 'Developed web applications',
            startDate: new Date('2019-07-01'),
            endDate: new Date('2021-08-01'),
          },
        ],
      },
      resumes: {
        create: [
          {
            filePath: '/resumes/john_doe.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
          },
        ],
      },
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@gmail.com',
      phone: '0987654321',
      address: '456 Elm St',
      educations: {
        create: [
          {
            institution: 'Maryland',
            title: 'MSc Data Science',
            startDate: new Date('2016-09-01'),
            endDate: new Date('2020-06-01'),
          },
        ],
      },
      workExperiences: {
        create: [
          {
            company: 'Gitlab',
            position: 'Data Scientist',
            description: 'Analyzed data sets',
            startDate: new Date('2020-07-01'),
            endDate: new Date('2022-08-01'),
          },
        ],
      },
      resumes: {
        create: [
          {
            filePath: '/resumes/jane_smith.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
          },
        ],
      },
    },
  });

  const candidate3 = await prisma.candidate.create({
    data: {
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos.garcia@example.com',
      phone: '1122334455',
      address: '789 Pine St',
      educations: {
        create: [
          {
            institution: 'Instituto Tecnológico',
            title: 'Ingeniería en Sistemas Computacionales',
            startDate: new Date('2017-01-01'),
            endDate: new Date('2021-12-01'),
          },
        ],
      },
      workExperiences: {
        create: [
          {
            company: 'Innovaciones Tech',
            position: 'Ingeniero de Software',
            description: 'Desarrollo y mantenimiento de aplicaciones de software',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-01-01'),
          },
        ],
      },
      resumes: {
        create: [
          {
            filePath: '/resumes/carlos_garcia.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
          },
        ],
      },
    },
  });

  // Create Interview Types
  const interviewType1 = await prisma.interviewType.create({
    data: {
      name: 'HR Interview',
      description: 'Assess overall fit, tech stack, salary range and availability',
    },
  });

  const interviewType2 = await prisma.interviewType.create({
    data: {
      name: 'Technical Interview',
      description: 'Assess technical skills',
    },
  });

  const interviewType3 = await prisma.interviewType.create({
    data: {
      name: 'Hiring manager interview',
      description: 'Assess cultural fit and professional goals',
    },
  });

  

  // Create Interview Steps
  const interviewStep1 = await prisma.interviewStep.create({
    data: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType1.id,
      name: 'Initial Screening',
      orderIndex: 1,
    },
  });

  const interviewStep2 = await prisma.interviewStep.create({
    data: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType2.id,
      name: 'Technical Interview',
      orderIndex: 2,
    },
  });

  const interviewStep3 = await prisma.interviewStep.create({
    data: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType3.id,
      name: 'Manager Interview',
      orderIndex: 3,
    },
  });

  // Create Employees (aligned with frontend managers)
  const employee1 = await prisma.employee.create({
    data: {
      companyId: company1.id,
      name: 'John Doe',
      email: 'john.doe@lti.com',
      role: 'Engineering Manager',
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      companyId: company1.id,
      name: 'Jane Smith',
      email: 'jane.smith@lti.com',
      role: 'Mobile Team Lead',
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      companyId: company1.id,
      name: 'Alex Jones',
      email: 'alex.jones@lti.com',
      role: 'VP of Product',
    },
  });

  const employee4 = await prisma.employee.create({
    data: {
      companyId: company1.id,
      name: 'Alice Johnson',
      email: 'alice.johnson@lti.com',
      role: 'HR Interviewer',
    },
  });

  // Create Applications
  const application1 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidate1.id,
      applicationDate: new Date(),
      currentInterviewStep: interviewStep2.id,
    },
  });

  const application2 = await prisma.application.create({
    data: {
      positionId: position2.id,
      candidateId: candidate2.id,
      applicationDate: new Date(),
      currentInterviewStep: interviewStep1.id,
    },
  });

  const application3 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidate2.id,
      applicationDate: new Date(),
      currentInterviewStep: interviewStep2.id,
    },
  });

  const application4 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidate3.id,
      applicationDate: new Date(),
      currentInterviewStep: interviewStep1.id,
    },
  });

  const application5 = await prisma.application.create({
    data: {
      positionId: position3.id,
      candidateId: candidate1.id,
      applicationDate: new Date(),
      currentInterviewStep: interviewStep1.id,
    },
  });


  // Create Interviews
  await prisma.interview.createMany({
    data: [
      {
        applicationId: application1.id,
        interviewStepId: interviewStep1.id,
        employeeId: employee4.id,
        interviewDate: new Date(),
        result: 'Passed',
        score: 5,
        notes: 'Excellent communication skills and strong background',
      },
      {
        applicationId: application3.id,
        interviewStepId: interviewStep1.id,
        employeeId: employee4.id,
        interviewDate: new Date(),
        result: 'Passed',
        score: 4,
        notes: 'Good technical background, ready for next step',
      },
      {
        applicationId: application4.id,
        interviewStepId: interviewStep1.id,
        employeeId: employee4.id,
        interviewDate: new Date(),
        result: 'Pending',
        score: 0,
        notes: 'Interview scheduled',
      }
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
