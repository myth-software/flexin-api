import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {Exercise, ExerciseRelations, Category, ExerciseCategory, Intensity, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ExerciseCategoryRepository} from './exercise-category.repository';
import {CategoryRepository} from './category.repository';
import {IntensityRepository} from './intensity.repository';
import {UserRepository} from './user.repository';

export class ExerciseRepository extends DefaultCrudRepository<
  Exercise,
  typeof Exercise.prototype.id,
  ExerciseRelations
> {
  public readonly categories: HasManyThroughRepositoryFactory<
    Category,
    typeof Category.prototype.id,
    ExerciseCategory,
    typeof Exercise.prototype.id
  >;

  public readonly intensities: HasManyRepositoryFactory<Intensity, typeof Exercise.prototype.id>;

  public readonly createdBy: BelongsToAccessor<User, typeof Exercise.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ExerciseCategoryRepository')
    protected exerciseCategoryRepositoryGetter: Getter<ExerciseCategoryRepository>,
    @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('IntensityRepository') protected intensityRepositoryGetter: Getter<IntensityRepository>,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Exercise, dataSource);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.intensities = this.createHasManyRepositoryFactoryFor('intensities', intensityRepositoryGetter);
    this.registerInclusionResolver('intensities', this.intensities.inclusionResolver);
    this.categories = this.createHasManyThroughRepositoryFactoryFor(
      'categories',
      categoryRepositoryGetter,
      exerciseCategoryRepositoryGetter,
    );
    this.registerInclusionResolver('categories', this.categories.inclusionResolver);
  }
}
