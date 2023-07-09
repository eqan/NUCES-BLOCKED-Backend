
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CareerCounsellorContributionType {
    EXCHANGE_PROGRAM = "EXCHANGE_PROGRAM",
    INTERNSHIP = "INTERNSHIP",
    FELLOWSHIP_PROGRAM = "FELLOWSHIP_PROGRAM"
}

export enum SocietyHeadsContributionType {
    UNIVERSITY_EVENT = "UNIVERSITY_EVENT",
    COMPETITION_ACHIEVEMENT = "COMPETITION_ACHIEVEMENT"
}

export enum TeacherContributionType {
    TA_SHIP = "TA_SHIP",
    RESEARCH = "RESEARCH"
}

export enum ContributionType {
    SOCIETY_HEAD = "SOCIETY_HEAD",
    TEACHER = "TEACHER",
    CAREER_COUNSELLOR = "CAREER_COUNSELLOR"
}

export enum EligibilityStatusEnum {
    NOT_ELIGIBLE = "NOT_ELIGIBLE",
    ELIGIBLE = "ELIGIBLE",
    ALREADY_PUBLISHED = "ALREADY_PUBLISHED",
    NOT_ALLOWED = "NOT_ALLOWED",
    IN_PROGRESS = "IN_PROGRESS"
}

export enum UserTypeEnum {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    CAREER_COUNSELLOR = "CAREER_COUNSELLOR",
    SOCIETY_HEAD = "SOCIETY_HEAD",
    VALIDATOR = "VALIDATOR",
    REGULAR_USER = "REGULAR_USER"
}

export enum SemesterTypesEnum {
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL"
}

export enum ProposalStatusEnum {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export interface ContributionTypeInput {
    type: ContributionType;
    contributionType: ContributionType;
    teacherContributionType?: Nullable<TeacherContributionType>;
    societyHeadContributionType?: Nullable<SocietyHeadsContributionType>;
    careerCounsellorContributionType?: Nullable<CareerCounsellorContributionType>;
}

export interface FilterUserDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    id?: Nullable<string>;
}

export interface FilterStudentDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    id?: Nullable<string>;
}

export interface FilterCertificateInput {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    id: string;
}

export interface GetContributionInput {
    contributionId?: Nullable<string>;
    contributor?: Nullable<string>;
    contributionType: ContributionType;
    studentId: string;
}

export interface FilterAllContributionDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    contributionType: ContributionType;
    contributor: string;
    studentId?: Nullable<string>;
}

export interface IndexContributionsOnStudentIdAndEligibilityInput {
    studentId: string;
    eligibility: EligibilityStatusEnum;
}

export interface FilterResultInput {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    id: string;
}

export interface FilterProposalInput {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    id: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    subType: string;
    type: UserTypeEnum;
    imgUrl: string;
}

export interface DeleteUsersInput {
    id: string[];
}

export interface UpdateUsersInput {
    id: string;
    email: string;
    name?: Nullable<string>;
    password?: Nullable<string>;
    type: UserTypeEnum;
    imgUrl?: Nullable<string>;
    subType?: Nullable<string>;
}

export interface CreateStudentInput {
    id: string;
    name: string;
    email: string;
    cgpa: string;
    batch: string;
    honours?: Nullable<string>;
}

export interface DeleteStudentsInput {
    id: string[];
}

export interface UpdateStudentInput {
    id?: Nullable<string>;
    email?: Nullable<string>;
    name?: Nullable<string>;
    cgpa?: Nullable<string>;
    batch: string;
    eligibilityStatus: EligibilityStatusEnum;
    honours?: Nullable<string>;
}

export interface UpdateStudentEligibilityInput {
    from: EligibilityStatusEnum;
    to: EligibilityStatusEnum;
}

export interface CreateCertificateDto {
    id: string;
    url: string;
}

export interface DeleteCertificatesInput {
    id: string[];
}

export interface UpdateCertificatesInput {
    id?: Nullable<string>;
    studentId?: Nullable<string>;
    url?: Nullable<string>;
}

export interface ContributionDto {
    contributionType: ContributionTypeInput;
    id?: Nullable<string>;
    title: string;
    contribution: string;
    contributor: string;
    studentId: string;
}

export interface DeleteContributionInput {
    contributionId?: Nullable<string>;
    contributionType: ContributionType;
    studentId: string;
}

export interface CreateResultDto {
    year: string;
    type: SemesterTypesEnum;
    url: string;
}

export interface DeleteResultsInput {
    id: string[];
}

export interface UpdateResultsInput {
    id: string;
    url: string;
}

export interface CreateProposalDto {
    id: string;
    description: string;
    yesVotes: number;
    noVotes: number;
    status: ProposalStatusEnum;
}

export interface DeleteProposalsInput {
    id: string[];
}

export interface Proposal {
    updatedAt: DateTime;
    id: string;
    description: string;
    yesVotes: number;
    noVotes: number;
    status: string;
}

export interface CareerCounsellorContributions {
    updatedAt: DateTime;
    id: string;
    studentId: string;
    title: string;
    careerCounsellorContributionType: CareerCounsellorContributionType;
    contribution: string;
    contributor: string;
    student?: Nullable<Student>;
}

export interface SocietyHeadsContributions {
    updatedAt: DateTime;
    id: string;
    studentId: string;
    title: string;
    societyHeadContributionType: SocietyHeadsContributionType;
    contribution: string;
    contributor: string;
    student?: Nullable<Student>;
}

export interface TeachersContributions {
    updatedAt: DateTime;
    id: string;
    studentId: string;
    title: string;
    teacherContributionType: TeacherContributionType;
    contribution: string;
    contributor: string;
    student?: Nullable<Student>;
}

export interface Student {
    updatedAt: DateTime;
    id: string;
    email: string;
    name: string;
    cgpa: string;
    batch: string;
    honours?: Nullable<string>;
    certificate?: Nullable<Certificate>;
    eligibilityStatus: string;
    CareerCounsellorContributions?: Nullable<CareerCounsellorContributions[]>;
    TeachersContributions?: Nullable<TeachersContributions[]>;
    SocietyHeadsContributions?: Nullable<SocietyHeadsContributions[]>;
}

export interface Certificate {
    updatedAt: DateTime;
    id: string;
    url: string;
    student?: Nullable<Student>;
}

export interface Users {
    id: string;
    email: string;
    name: string;
    password: string;
    imgUrl: string;
    type: string;
    subType: string;
}

export interface GetAllUsers {
    items: Users[];
    total: number;
}

export interface LoggedUserOutput {
    access_token: string;
}

export interface GetAllContributions {
    careerCounsellorContributions?: Nullable<CareerCounsellorContributions[]>;
    societyHeadsContributions?: Nullable<SocietyHeadsContributions[]>;
    teachersContribution?: Nullable<TeachersContributions[]>;
    total?: Nullable<number>;
}

export interface IndexAllContributionsForCVDTO {
    careerCounsellorContributions?: Nullable<CareerCounsellorContributions[]>;
    societyHeadsContributions?: Nullable<SocietyHeadsContributions[]>;
    teachersContribution?: Nullable<TeachersContributions[]>;
}

export interface SemesterResult {
    updatedAt: DateTime;
    id: string;
    url: string;
    year: string;
    type: string;
}

export interface GetAllResults {
    items: SemesterResult[];
    total: number;
}

export interface GetAllCertificates {
    items: Certificate[];
    total: number;
}

export interface GetAllStudents {
    items: Student[];
    total: number;
}

export interface GetAllProposals {
    items: Proposal[];
    total: number;
}

export interface IQuery {
    GetUserDataByUserEmail(userEmail: string): Nullable<Users> | Promise<Nullable<Users>>;
    GetAllUsers(filterUserDto?: Nullable<FilterUserDto>): GetAllUsers | Promise<GetAllUsers>;
    GetStudentDataByUserId(studentId: string): Nullable<Student> | Promise<Nullable<Student>>;
    GetAllStudents(filterStudentDto?: Nullable<FilterStudentDto>): GetAllStudents | Promise<GetAllStudents>;
    IndexByEligibilityStatus(eligibility: string): Nullable<Student[]> | Promise<Nullable<Student[]>>;
    GetCertificateByRollNumber(id: string): Nullable<Certificate> | Promise<Nullable<Certificate>>;
    GetAllCertificates(FilterCertificateInput?: Nullable<FilterCertificateInput>): GetAllCertificates | Promise<GetAllCertificates>;
    GetContribution(GetContributionInput: GetContributionInput): Nullable<Student> | Promise<Nullable<Student>>;
    GetAllContributions(FilterContributionsDto?: Nullable<FilterAllContributionDto>): GetAllContributions | Promise<GetAllContributions>;
    IndexAllContributionsOnCriteria(IndexAllContributionsDto: IndexContributionsOnStudentIdAndEligibilityInput): Nullable<IndexAllContributionsForCVDTO> | Promise<Nullable<IndexAllContributionsForCVDTO>>;
    GetResult(id: string): Nullable<SemesterResult> | Promise<Nullable<SemesterResult>>;
    GetAllResults(FilterResultInput?: Nullable<FilterResultInput>): GetAllResults | Promise<GetAllResults>;
    GetAllProposals(FilterProposalInput?: Nullable<FilterProposalInput>): GetAllProposals | Promise<GetAllProposals>;
}

export interface IMutation {
    LoginUser(LoginUserInput: LoginUserInput): LoggedUserOutput | Promise<LoggedUserOutput>;
    CreateUser(CreateUserInput: CreateUserInput): Users | Promise<Users>;
    DeleteUser(DeleteUserInput: DeleteUsersInput): Nullable<Users> | Promise<Nullable<Users>>;
    UpdateUser(UpdateUserInput: UpdateUsersInput): Users | Promise<Users>;
    CreateStudent(CreateStudentInput: CreateStudentInput): Student | Promise<Student>;
    DeleteStudent(DeleteStudentInput: DeleteStudentsInput): Nullable<Student> | Promise<Nullable<Student>>;
    UpdateStudent(UpdateStudentInput: UpdateStudentInput): Student | Promise<Student>;
    UpdateEligibilityStatusForAllStudents(): string | Promise<string>;
    UpdateStudentsEligibility(UpdateEligibilityInput: UpdateStudentEligibilityInput): Nullable<string> | Promise<Nullable<string>>;
    CreateCertificateInBatches(CreateCertificateInput: CreateCertificateDto[]): boolean | Promise<boolean>;
    CreateCertificate(CreateCertificateInput: CreateCertificateDto): Certificate | Promise<Certificate>;
    StartCertificateCronJob(): string | Promise<string>;
    StopCertificateCronJob(): string | Promise<string>;
    DeleteCertificate(DeleteCertificateInput: DeleteCertificatesInput): Nullable<Certificate> | Promise<Nullable<Certificate>>;
    UpdateCertificate(UpdateCertificateInput: UpdateCertificatesInput): Certificate | Promise<Certificate>;
    CreateContribution(CreateStudentInput: ContributionDto): Nullable<Student> | Promise<Nullable<Student>>;
    UpdateContribution(UpdateStudentInput: ContributionDto): Nullable<Student> | Promise<Nullable<Student>>;
    DeleteContribution(DeleteContributionInput: DeleteContributionInput[]): Nullable<Student> | Promise<Nullable<Student>>;
    CreateResult(CreateResultInput: CreateResultDto): SemesterResult | Promise<SemesterResult>;
    StartResultCronJob(): string | Promise<string>;
    StopResultCronJob(): string | Promise<string>;
    DeleteResult(DeleteResultInput: DeleteResultsInput): Nullable<SemesterResult> | Promise<Nullable<SemesterResult>>;
    UpdateResult(UpdateResultInput: UpdateResultsInput): SemesterResult | Promise<SemesterResult>;
    CreateProposal(CreateProposalInput: CreateProposalDto): Proposal | Promise<Proposal>;
    StartProposalCronJob(): string | Promise<string>;
    StopProposalCronJob(): string | Promise<string>;
    UpdateAllStatusFromBlockchainAndDatabase(): string | Promise<string>;
    DeleteProposal(DeleteProposalInput: DeleteProposalsInput): Nullable<Proposal> | Promise<Nullable<Proposal>>;
}

export type DateTime = any;
type Nullable<T> = T | null;
