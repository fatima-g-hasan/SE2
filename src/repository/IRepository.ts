export type id = string;

export interface ID {
  getId(): string;
}


export interface Initializable {

  /**
   * init - Initializes the creation of required tables and establishes a connection.
   * 
   * @throws InitializationException - If the initialization process fails.
   * 
   * @returns A promise that resolves when the initialization is complete.
   */

  init(): Promise<void>;
}


/**
 * Interface representing a generic repository for managing items of type T.
 * 
 * @template T - The type of items managed by the repository, which extends ID.
 */
export interface IRepository<T extends ID> {
  
  /**
   * Create a new item in the repository
   * 
   * @param item - The item to be created.
   * @returns A promise that resolves to the ID of the created item.
   * @throws {InvalidItemExceptions} - Thrown when an invalid item is encountered. 
   * @throws {DbException} - Thrown when an error occurs while interacting with the database. 
   */
  create (item: T): Promise<id>; 

  /**
   * Retrieve an item from the repository by its ID.
   * 
   * @param id - The ID if the item to be retrieved.
   * @returns A promise that resolves to the item with the specific ID.
   * @throws {ItemNotFoundException} - Thrown when an item with the specified ID is not found.
   * @throws {DbException} - Thrown when an error occurs while interacting with the database.
   */
  get(id: id): Promise<T>;

  /**
   * Retrieve all items from the repository.
   * 
   * @returns A promise that resolves to an array of all the items in the repository.
   * @throws {DbException} - Thrown when an error occurs while interacting with the database.
   */
  getAll(): Promise<T[]>;

  /**
   * Update an existing item in the repository.
   * 
   * @param item - The item to be updated.
   * @returns A promise that resolves when the item is successfully updated.
   * @throws {ItemNotFoundException} - Thrown when the item to be updated is not found.
   * @throws {InvalidItemException} - Thrown when an invalid item is encountered. 
   * @throws {DbException} - Thrown when an error occurs while interacting with the database.
   */
  update(item: T): Promise<void>;

  /**
   * Delete an item from the repository by its ID
   * @param id - The ID of the item to be deleted.
   * @returns A promise the resolves when the item is successfully deleted.
   * @throws {ItemNotFoundException} - Thrown when an item with the specified ID is not found.
   * @throws {DbException} - Thrown when an error occurs while interacting with the database.
   */
  delete(id: id): Promise<void>;
}

export interface InitializableRepository<T extends ID> extends IRepository<T>, Initializable {

}