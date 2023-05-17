/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export declare namespace UserJson {
  type RetrieveUserParams = {
    filters: string[] | null;
    sorters: string[] | null;
  };

  enum Level {
    A1 = 'A1',
    A2 = 'A1',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2',
    D1 = 'D1',
    D2 = 'D2',
    E1 = 'E1',
    E2 = 'E2',
  }

  enum BusinessArea {
    NUCLEAR_ENGINEERING = 'Nuclear Engineering',
    ENGINEERING = 'Engineering',
    SALES = 'Sales',
    FINANCE = 'Finance',
    IT = 'IT',
  }

  enum AssetType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
  }

  enum EmploymentStatus {
    ACTIVE = 'ACTIVE',
    DEACTIVE = 'DEACTIVE',
  }

  enum Status {
    NEW = 'New',
    IN_PROGRESS = 'In progress',
    REVIEWED = 'Reviewed',
    CASE_OPENED = 'Case Opened',
    CASE_CLOSED = 'Case Closed',
  }

  type Asset = {
    url: string;
    type: AssetType;
    thumbnail?: string;
  };

  type Address = {
    address1?: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: Asset;
    email: string;
    phone: string;
    address: Address;
    title: string;
    level: Level;
    businessArea: BusinessArea;
    businessLocation: Address;
    employementStatus: EmploymentStatus;
    employementStartDate: string;
    employementEndDate: string;
    clearance: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
  };
}
